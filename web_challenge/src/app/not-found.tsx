'use client';

import React from 'react';
import { Box, VStack, Text, Button, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';

/**
 * 自定义 404 页面
 * 处理页面未找到的情况
 */
export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(ROUTES.HOME);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <VStack spacing={6} textAlign="center" maxW="md">
        <Heading size="2xl" color="gray.600">
          404
        </Heading>
        
        <VStack spacing={2}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.700">
            页面未找到
          </Text>
          <Text color="gray.500" lineHeight="tall">
            抱歉，您访问的页面不存在或已被移动。
          </Text>
        </VStack>
        
        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleGoHome}
            _hover={{ transform: 'translateY(-1px)' }}
          >
            返回首页
          </Button>
          
          <Button
            variant="outline"
            size="md"
            onClick={handleGoBack}
            _hover={{ bg: 'gray.100' }}
          >
            返回上一页
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}