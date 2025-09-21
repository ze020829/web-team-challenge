'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Badge,
  Alert,
  AlertIcon,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useUserInfo } from '@/hooks/useUserInfo';
import { UserInfoForm } from '@/components/user/UserInfoForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * 用户信息管理页面
 * 允许用户查看和修改个人信息
 */
export default function ProfilePage() {
  const { userInfo, isLoading, removeUser } = useUserInfo();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  // 格式化日期
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // 编辑成功处理
  const handleEditSuccess = () => {
    setIsEditing(false);
    toast({
      title: '信息更新成功',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // 取消编辑
  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // 清除用户信息
  const handleClearInfo = () => {
    if (window.confirm('确定要清除所有用户信息吗？这将需要重新填写信息。')) {
      removeUser();
      toast({
        title: '用户信息已清除',
        description: '请重新填写用户信息',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        text="加载用户信息中..."
      />
    );
  }

  // 用户信息不存在
  if (!userInfo) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="warning">
          <AlertIcon />
          未找到用户信息，请先填写用户信息
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        {/* 页面标题 */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            个人信息管理
          </Heading>
          <Text color="gray.600">
            查看和管理您的个人信息
          </Text>
        </Box>

        {/* 用户信息卡片 */}
        <Card>
          <CardBody>
            {isEditing ? (
              // 编辑模式
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  编辑个人信息
                </Text>
                <UserInfoForm
                  initialData={{
                    username: userInfo.username,
                    jobTitle: userInfo.jobTitle,
                  }}
                  isEditing
                  onSuccess={handleEditSuccess}
                  onCancel={handleEditCancel}
                />
              </Box>
            ) : (
              // 查看模式
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    个人信息
                  </Text>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    编辑
                  </Button>
                </HStack>

                <Divider />

                {/* 用户名 */}
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium" color="gray.600">
                    用户名:
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    {userInfo.username}
                  </Text>
                </HStack>

                {/* 职位 */}
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium" color="gray.600">
                    职位:
                  </Text>
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    {userInfo.jobTitle}
                  </Badge>
                </HStack>

                <Divider />

                {/* 创建时间 */}
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium" color="gray.600">
                    创建时间:
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(userInfo.createdAt)}
                  </Text>
                </HStack>

                {/* 更新时间 */}
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium" color="gray.600">
                    更新时间:
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(userInfo.updatedAt)}
                  </Text>
                </HStack>
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* 操作按钮 */}
        {!isEditing && (
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  数据管理
                </Text>
                
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  清除用户信息将删除所有本地存储的数据，您需要重新填写信息才能继续使用应用。
                </Text>
                
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={handleClearInfo}
                  leftIcon={<CloseIcon />}
                >
                  清除用户信息
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* 使用说明 */}
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack>
                <CheckIcon color="blue.500" />
                <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                  使用说明
                </Text>
              </HStack>
              
              <VStack spacing={2} align="start" pl={6}>
                <Text fontSize="sm" color="blue.600">
                  • 用户信息存储在浏览器本地，不会上传到服务器
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • 清除浏览器数据会导致用户信息丢失
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • 修改信息后会自动更新时间戳
                </Text>
                <Text fontSize="sm" color="blue.600">
                  • 用户信息是访问数据页面的必要条件
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}