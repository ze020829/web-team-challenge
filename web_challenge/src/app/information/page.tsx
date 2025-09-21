'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Character } from '@/types';
import { useCharacters, useCharacter } from '@/hooks/useCharacters';
import { useUserInfo } from '@/hooks/useUserInfo';
import { CharacterTable } from '@/components/data/CharacterTable';
import { Pagination } from '@/components/data/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CharacterDetailModal } from '@/components/data/CharacterDetailModal';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

/**
 * 数据展示页面
 * 展示 GraphQL 数据表格、分页和页面内角色详情
 */
export default function InformationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userInfo, isLoading: userLoading } = useUserInfo();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // 从 URL 参数获取当前页码
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // GraphQL 数据获取
  const {
    characters,
    loading: charactersLoading,
    error: charactersError,
    pageInfo,
    fetchCharacters,
  } = useCharacters(currentPage, pageSize);
  
  const {
    character: characterDetail,
    loading: characterLoading,
    fetchCharacter,
  } = useCharacter();

  // 页码变化处理
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/information?${params.toString()}`);
  };

  // 页面大小变化处理
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    // 重置到第一页
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.push(`/information?${params.toString()}`);
  };

  // 角色点击处理
  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    fetchCharacter(character.id);
    onOpen();
  };

  // 模态框关闭处理
  const handleModalClose = () => {
    console.log('开始关闭模态框');
    // 先关闭模态框
    onClose();
    // 延迟清理选中的角色状态，确保模态框完全关闭
    setTimeout(() => {
      setSelectedCharacter(null);
      console.log('模态框关闭完成，已清理选中角色状态');
    }, 100);
  };



  // 当页码或页面大小变化时重新获取数据
  useEffect(() => {
    if (userInfo) {
      fetchCharacters(currentPage, pageSize);
    }
  }, [currentPage, pageSize, userInfo, fetchCharacters]);

  // 用户信息加载中
  if (userLoading) {
    return (
      <LoadingSpinner
        fullScreen
        text="初始化中..."
      />
    );
  }

  // 用户信息不存在（理论上不会到达这里，因为有全局拦截）
  if (!userInfo) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="warning">
          <AlertIcon />
          请先填写用户信息后再访问此页面
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* 页面标题和设置 */}
        <Box>
          <Box textAlign="center" mb={4}>
            <Heading size="lg" mb={2}>
              动漫角色数据
            </Heading>
            <Text color="gray.600">
              浏览和查看来自 AniList 的动漫角色信息
            </Text>
          </Box>
          

        </Box>

        {/* 错误提示 */}
        {charactersError && (
          <Alert status="error">
            <AlertIcon />
            数据加载失败: {charactersError}
          </Alert>
        )}

        <VStack spacing={6} align="stretch">
          {/* 数据表格 */}
          <Box>
            <CharacterTable
              characters={characters}
              loading={charactersLoading}
              onCharacterClick={handleCharacterClick}
            />
          </Box>

          {/* 分页组件 */}
          {pageInfo && (
            <Box>
              <Pagination
                currentPage={pageInfo.currentPage}
                totalPages={pageInfo.lastPage}
                totalItems={pageInfo.total}
                itemsPerPage={pageInfo.perPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 20, 50]}
                showPageSizeSelector
                showItemsInfo
              />
            </Box>
          )}
        </VStack>

        {/* 角色详情模态框 */}
        <CharacterDetailModal
          isOpen={isOpen}
          onClose={handleModalClose}
          character={characterDetail || selectedCharacter}
          loading={characterLoading}
        />
      </VStack>
    </Container>
  );
}