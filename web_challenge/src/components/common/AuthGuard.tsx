'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ROUTES } from '@/utils/constants';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 认证守卫组件
 * 保护需要登录才能访问的页面和组件
 * 如果用户未登录，自动重定向到登录页面
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { userInfo, isLoading } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    // 如果加载完成且用户未登录，重定向到登录页面
    if (!isLoading && !userInfo) {
      console.log('AuthGuard: 用户未登录，重定向到登录页面');
      
      // 使用 replace 避免历史记录堆积
      router.replace(ROUTES.LOGIN);
      
      // 备用重定向机制
      const timeoutId = setTimeout(() => {
        if (typeof window !== 'undefined' && !userInfo) {
          console.log('AuthGuard: 备用重定向机制触发');
          window.location.href = ROUTES.LOGIN;
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [userInfo, isLoading, router]);

  // 监听用户状态变化，立即重定向
  useEffect(() => {
    if (!userInfo && !isLoading) {
      console.log('AuthGuard: 用户状态变化，立即重定向');
      
      // 防抖处理，避免频繁重定向
      const timeoutId = setTimeout(() => {
        if (typeof window !== 'undefined' && !userInfo) {
          window.location.href = ROUTES.LOGIN;
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [userInfo, isLoading]);

  // 加载状态
  if (isLoading) {
    return (
      fallback || (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="gray.600" fontSize="lg">
              正在验证用户信息...
            </Text>
          </VStack>
        </Box>
      )
    );
  }

  // 用户未登录，显示重定向信息
  if (!userInfo) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">
            正在跳转到登录页面...
          </Text>
        </VStack>
      </Box>
    );
  }

  // 用户已登录，渲染子组件
  return <>{children}</>;
};

export default AuthGuard;