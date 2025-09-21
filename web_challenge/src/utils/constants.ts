// GraphQL API 配置
export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://graphql.anilist.co';

// 应用版本
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'v 3.5';

// 分页配置
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

// localStorage 键名
export const USER_INFO_KEY = 'user_info';

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  INFORMATION: '/information',
  PROFILE: '/profile',
} as const;

// 表单验证规则
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
  },
  JOB_TITLE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;

// UI 配置
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1200,
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  GRAPHQL_ERROR: 'GraphQL 查询失败',
  USER_INFO_REQUIRED: '请先填写用户信息',
  INVALID_USERNAME: '用户名格式不正确',
  INVALID_JOB_TITLE: '职位名称格式不正确',
} as const;