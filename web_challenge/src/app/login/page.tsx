'use client';

import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { UserInfoForm } from '@/components/user/UserInfoForm';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ROUTES } from '@/utils/constants';

/**
 * 登录页面组件
 * 用户需要在此页面填写用户名和职位信息才能访问其他页面
 */
export default function LoginPage() {
  const { userInfo, isLoading } = useUserInfo();
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (!isLoading && userInfo) {
      router.replace(ROUTES.HOME);
    }
  }, [userInfo, isLoading, router]);

  const handleLoginSuccess = () => {
    // 登录成功后重定向到首页
    router.replace(ROUTES.HOME);
  };

  // 加载状态
  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bgGradient={bgGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>加载中...</Text>
      </Box>
    );
  }

  // 如果已登录，显示重定向信息
  if (userInfo) {
    return (
      <Box
        minH="100vh"
        bgGradient={bgGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>正在跳转...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="md" py={20}>
        <VStack spacing={8} align="stretch">
          {/* 页面标题 */}
          <VStack spacing={4} textAlign="center">
            <Icon as={LockIcon} boxSize={12} color="blue.500" />
            <Heading size="xl" color="gray.700">
              欢迎使用 GraphQL 数据平台
            </Heading>
            <Text fontSize="lg" color="gray.600">
              请填写您的基本信息以开始使用
            </Text>
          </VStack>

          {/* 登录表单卡片 */}
          <Card bg={cardBg} shadow="xl" borderRadius="xl">
            <CardBody p={8}>
              <VStack spacing={6}>
                <VStack spacing={2} textAlign="center">
                  <Heading size="md" color="gray.700">
                    用户信息
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    为了更好地为您服务，请先填写基本信息
                  </Text>
                </VStack>

                <UserInfoForm
                  onSuccess={handleLoginSuccess}
                  isEditing={false}
                />
              </VStack>
            </CardBody>
          </Card>

          {/* 页面说明 */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              您的信息将安全保存在本地存储中
            </Text>
            <Text fontSize="sm" color="gray.500">
              登录后可以在个人信息页面修改这些信息
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}