'use client';

import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ViewIcon, SettingsIcon, StarIcon, InfoIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ROUTES, APP_VERSION } from '@/utils/constants';

export default function Home() {
  const { userInfo, isLoading } = useUserInfo();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // 移除自动跳转逻辑，避免与用户信息模态框冲突
  // 用户可以通过页面上的按钮手动导航到数据展示页面

  const features = [
    {
      icon: SettingsIcon,
      title: '用户信息管理',
      description: '安全的用户信息收集和管理系统，支持本地存储和实时验证',
      color: 'blue',
    },
    {
      icon: ViewIcon,
      title: 'GraphQL 数据展示',
      description: '基于 AniList API 的动漫角色数据，支持分页和详情查看',
      color: 'green',
    },
    {
      icon: StarIcon,
      title: '响应式设计',
      description: '移动端和桌面端完美适配，提供最佳用户体验',
      color: 'purple',
    },
    {
      icon: InfoIcon,
      title: '现代化技术栈',
      description: 'Next.js + TypeScript + Chakra UI + Apollo Client',
      color: 'orange',
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={12} align="stretch">
        {/* 英雄区域 */}
        <Box textAlign="center" py={10}>
          <VStack spacing={6}>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
              版本 {APP_VERSION}
            </Badge>
            
            <Heading
              size={isMobile ? 'xl' : '2xl'}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              GraphQL 数据展示平台
            </Heading>
            
            <Text
              fontSize={isMobile ? 'lg' : 'xl'}
              color="gray.600"
              maxW="2xl"
              lineHeight="tall"
            >
              基于 Next.js App Router + TypeScript 的现代化数据展示平台，
              通过用户信息验证机制确保数据安全访问
            </Text>
            
            <HStack spacing={4} pt={4}>
              <Button
                as={Link}
                href={ROUTES.INFORMATION}
                colorScheme="blue"
                size="lg"
                rightIcon={<ArrowForwardIcon />}
              >
                开始使用
              </Button>
              
              <Button
                as={Link}
                href={ROUTES.PROFILE}
                variant="outline"
                size="lg"
              >
                个人信息
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* 功能特性 */}
        <Box>
          <VStack spacing={8}>
            <Box textAlign="center">
              <Heading size="lg" mb={4}>
                平台特性
              </Heading>
              <Text color="gray.600" fontSize="lg">
                为您提供完整的数据浏览和管理解决方案
              </Text>
            </Box>
            
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={6}
              w="full"
            >
              {features.map((feature, index) => (
                <GridItem key={index}>
                  <Card
                    height="full"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    <CardBody>
                      <VStack spacing={4} align="start" height="full">
                        <Icon
                          as={feature.icon}
                          boxSize={8}
                          color={`${feature.color}.500`}
                        />
                        
                        <VStack spacing={2} align="start" flex={1}>
                          <Heading size="md" color="gray.800">
                            {feature.title}
                          </Heading>
                          
                          <Text color="gray.600" fontSize="sm" lineHeight="tall">
                            {feature.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Box>

        {/* 技术栈信息 */}
        <Card bg="gray.50" borderColor="gray.200">
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md" color="gray.700">
                技术栈
              </Heading>
              
              <HStack spacing={4} wrap="wrap" justify="center">
                {[
                  'Next.js 15',
                  'React 19',
                  'TypeScript 5',
                  'Chakra UI 3',
                  'Apollo Client 4',
                  'GraphQL',
                ].map((tech) => (
                  <Badge
                    key={tech}
                    colorScheme="gray"
                    variant="solid"
                    px={3}
                    py={1}
                    fontSize="sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </HStack>
              
              <Text fontSize="sm" color="gray.600" textAlign="center">
                使用最新的前端技术栈，确保应用的性能和可维护性
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* 使用说明 */}
        <Card borderColor="blue.200" bg="blue.50">
          <CardBody>
            <VStack spacing={4} align="start">
              <Heading size="md" color="blue.700">
                使用说明
              </Heading>
              
              <VStack spacing={2} align="start" pl={4}>
                <Text fontSize="sm" color="blue.600">
                  1. 首次访问需要填写用户名和职位信息
                </Text>
                <Text fontSize="sm" color="blue.600">
                  2. 用户信息将安全存储在浏览器本地
                </Text>
                <Text fontSize="sm" color="blue.600">
                  3. 填写信息后即可访问动漫角色数据页面
                </Text>
                <Text fontSize="sm" color="blue.600">
                  4. 支持分页浏览和详情查看功能
                </Text>
                <Text fontSize="sm" color="blue.600">
                  5. 可随时在个人信息页面修改用户信息
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}