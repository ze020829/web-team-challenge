'use client';

import React from 'react';
import {
  Box,
  Container,
  Text,
  HStack,
  VStack,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';
import { APP_VERSION } from '@/utils/constants';

/**
 * 页脚组件
 * 展示应用版本号和其他信息
 */
export const Footer: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentYear = new Date().getFullYear();

  return (
    <Box
      bg="gray.50"
      color="gray.600"
      borderTop="1px"
      borderColor="gray.200"
      mt="auto"
    >
      <Container maxW="container.xl" py={6}>
        {isMobile ? (
          // 移动端垂直布局
          <VStack spacing={3} textAlign="center">
            <Text fontSize="sm" fontWeight="medium">
              GraphQL 数据展示平台
            </Text>
            
            <Divider />
            
            <VStack spacing={1}>
              <Text fontSize="xs">
                版本 {APP_VERSION}
              </Text>
              <Text fontSize="xs">
                © {currentYear} 保留所有权利
              </Text>
            </VStack>
          </VStack>
        ) : (
          // 桌面端水平布局
          <HStack justify="space-between" align="center">
            <VStack spacing={1} align="start">
              <Text fontSize="sm" fontWeight="medium">
                GraphQL 数据展示平台
              </Text>
              <Text fontSize="xs">
                基于 Next.js + Apollo Client + Chakra UI 构建
              </Text>
            </VStack>
            
            <VStack spacing={1} align="end">
              <Text fontSize="xs" fontWeight="medium">
                版本 {APP_VERSION}
              </Text>
              <Text fontSize="xs">
                © {currentYear} 保留所有权利
              </Text>
            </VStack>
          </HStack>
        )}
      </Container>
    </Box>
  );
};

export default Footer;