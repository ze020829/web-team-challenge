import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { GRAPHQL_ENDPOINT } from '@/utils/constants';

// 在开发环境下加载Apollo Client错误消息
if (process.env.NODE_ENV === 'development') {
  import('@apollo/client/dev').then(({ loadErrorMessages, loadDevMessages }) => {
    loadDevMessages();
    loadErrorMessages();
  }).catch(console.error);
}

// 重试链接配置
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // 只对网络错误进行重试，不对 GraphQL 错误重试
      return !!error && !error.result;
    },
  },
});

// 增强的错误处理链接
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // 在开发环境下显示更详细的 GraphQL 错误信息
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL error details:', {
          operation: operation.operationName,
          variables: operation.variables,
          query: operation.query.loc?.source.body,
        });
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // 如果是开发环境，显示更详细的错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('Network error details:', {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack,
        operation: operation.operationName,
        variables: operation.variables,
        statusCode: (networkError as any)?.statusCode,
        response: (networkError as any)?.response,
      });
    }
    
    // 对于特定的网络错误，尝试恢复
    if (networkError.message.includes('ERR_ABORTED')) {
      console.warn('检测到请求被中止，可能是由于页面导航或组件卸载');
      return;
    }
    
    if (networkError.message.includes('Failed to fetch')) {
      console.warn('网络请求失败，可能是网络连接问题');
    }
  }
});

// 创建 HTTP 链接
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  // 添加更多配置以便调试和稳定性
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 添加请求超时
  fetch: (uri, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
    
    return fetch(uri, {
      ...options,
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeoutId);
    });
  },
});

// 创建 Apollo Client 实例
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Character: {
        keyFields: ['id'],
        merge(existing, incoming) {
          // 确保合并时保留所有字段
          return { ...existing, ...incoming };
        },
      },
      Media: {
        keyFields: ['id'],
        merge(existing, incoming) {
          // 确保合并时保留所有字段
          return { ...existing, ...incoming };
        },
      },
      Page: {
        keyFields: false,
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
    // 添加数据ID提取函数以确保正确识别对象
    dataIdFromObject(object) {
      if (object.__typename && object.id) {
        return `${object.__typename}:${object.id}`;
      }
      return undefined;
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
  },
  // 注意：connectToDevTools选项已被弃用，Apollo DevTools会自动连接
});

export default apolloClient;