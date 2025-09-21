'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from '@chakra-ui/react';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ROUTES } from '@/utils/constants';

/**
 * 头部导航栏组件
 * 支持响应式设计和用户信息管理
 */
export const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo, removeUser } = useUserInfo();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    removeUser();
    
    // 清除 Apollo Client 缓存
    if (typeof window !== 'undefined') {
      try {
        const { apolloClient } = await import('@/lib/apollo-client');
        await apolloClient.clearStore();
      } catch (error) {
        // 忽略缓存清除错误
      }
    }
    
    router.replace(ROUTES.LOGIN);
  };

  const handleMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMenuClose = () => {
    setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  const handleUserInfoEdit = () => {
    router.push(ROUTES.PROFILE);
  };

  const navigationItems = [
    { label: '数据展示', href: ROUTES.INFORMATION },
    { label: '个人信息', href: ROUTES.PROFILE },
  ];

  // 桌面端导航菜单
  const DesktopNav = () => (
    <HStack spacing={4}>
      {navigationItems.map((item) => (
        <Button
          key={item.href}
          as={Link}
          href={item.href}
          variant="ghost"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          {item.label}
        </Button>
      ))}
    </HStack>
  );

  // 移动端导航抽屉
  const MobileNav = () => (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>导航菜单</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                as={Link}
                href={item.href}
                variant="ghost"
                justifyContent="flex-start"
                onClick={onClose}
              >
                {item.label}
              </Button>
            ))}
            
            <Box pt={4}>
              <Text fontSize="sm" color="gray.500" mb={2}>
                用户信息
              </Text>
              <VStack spacing={2} align="stretch">
                {userInfo ? (
                  // 已登录状态
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleUserInfoEdit();
                        onClose();
                      }}
                    >
                      编辑信息
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="red"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        onClose();
                      }}
                    >
                      退出登录
                    </Button>
                  </>
                ) : (
                  // 未登录状态
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      handleLogin();
                      onClose();
                    }}
                  >
                    登录
                  </Button>
                )}
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  // 用户菜单
  const UserMenu = () => {
    // 未登录状态 - 显示登录按钮
    if (!userInfo) {
      return (
        <Button
          variant="outline"
          color="white"
          borderColor="white"
          size="sm"
          _hover={{ bg: 'whiteAlpha.200' }}
          onClick={handleLogin}
        >
          登录
        </Button>
      );
    }

    // 已登录状态 - 显示用户菜单（使用Popover作为备选方案）
    return (
      <Box ref={menuRef} position="relative">
        <Popover 
          isOpen={isUserMenuOpen} 
          onClose={handleMenuClose}
          placement="bottom-end"
          closeOnBlur={true}
          closeOnEsc={true}
        >
          <PopoverTrigger>
            <Button
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
              p={2}
              h="auto"
              minH={10}
              onClick={handleMenuToggle}
              aria-label="用户菜单"
              bg={isUserMenuOpen ? 'whiteAlpha.300' : 'transparent'}
            >
              <HStack spacing={2}>
                <Avatar size="sm" name={userInfo.username} />
                {!isMobile && (
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm" color="white" fontWeight="medium">
                      {userInfo.username}
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.800">
                      {userInfo.jobTitle}
                    </Text>
                  </VStack>
                )}
              </HStack>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent
            bg="white"
            borderColor="gray.200"
            boxShadow="lg"
            minW="200px"
            maxW="250px"
            _focus={{ boxShadow: 'lg' }}
          >
            <PopoverBody p={0}>
              <VStack spacing={0} align="stretch">
                <Button 
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={() => {
                    handleUserInfoEdit();
                    setIsUserMenuOpen(false);
                  }}
                  _hover={{ bg: 'gray.100' }}
                  borderRadius={0}
                  py={3}
                >
                  <SettingsIcon mr={2} />
                  编辑信息
                </Button>
                <Box h="1px" bg="gray.200" />
                <Button 
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                  color="red.500"
                  _hover={{ bg: 'red.50' }}
                  borderRadius={0}
                  py={3}
                >
                  退出登录
                </Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    );
  };

  return (
    <Box bg="blue.600" color="white" px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box>
          <Text
            as={Link}
            href={ROUTES.HOME}
            fontSize="xl"
            fontWeight="bold"
            _hover={{ textDecoration: 'none' }}
          >
            GraphQL 数据平台
          </Text>
        </Box>

        {/* 桌面端导航 */}
        {!isMobile && (
          <Flex alignItems="center" gap={4}>
            <DesktopNav />
          </Flex>
        )}

        {/* 右侧用户区域 */}
        <Flex alignItems="center" gap={4}>
          {!isMobile && <UserMenu />}
          
          {/* 移动端菜单按钮 */}
          {isMobile && (
            <HStack spacing={2}>
              <UserMenu />
              <IconButton
                aria-label="打开菜单"
                icon={<HamburgerIcon />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={onOpen}
              />
            </HStack>
          )}
        </Flex>
      </Flex>

      {/* 移动端导航抽屉 */}
      {isMobile && <MobileNav />}
    </Box>
  );
};

export default Header;