'use client';

import React from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  IconButton,
  Select,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { usePagination } from '@/hooks/useCharacters';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemsInfo?: boolean;
}

/**
 * 分页组件
 * 支持页码跳转、页面大小选择和响应式设计
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  showPageSizeSelector = true,
  showItemsInfo = true,
}) => {
  const {
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
  } = usePagination(totalPages, currentPage, onPageChange);

  // 响应式设计：移动端显示更少的页码按钮
  const maxVisiblePages = useBreakpointValue({ base: 3, md: 5, lg: 7 }) || 5;
  const isMobile = useBreakpointValue({ base: true, md: false });

  // 计算显示的页码范围
  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // 调整范围以确保显示足够的页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box>
      {/* 项目信息 */}
      {showItemsInfo && (
        <Text
          fontSize="sm"
          color="gray.600"
          textAlign="center"
          mb={4}
        >
          显示第 {startItem} - {endItem} 项，共 {totalItems} 项
        </Text>
      )}

      {/* 分页控件 */}
      <HStack
        spacing={2}
        justify="center"
        wrap="wrap"
        mb={showPageSizeSelector ? 4 : 0}
      >
        {/* 首页按钮 */}
        {!isMobile && !isFirstPage && (
          <Button
            size="sm"
            variant="outline"
            onClick={goToFirstPage}
          >
            首页
          </Button>
        )}

        {/* 上一页按钮 */}
        <IconButton
          aria-label="上一页"
          icon={<ChevronLeftIcon />}
          size="sm"
          variant="outline"
          onClick={goToPrevPage}
          isDisabled={!hasPrevPage}
        />

        {/* 页码按钮 */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            size="sm"
            variant={page === currentPage ? 'solid' : 'outline'}
            colorScheme={page === currentPage ? 'blue' : 'gray'}
            onClick={() => goToPage(page)}
            minW="40px"
          >
            {page}
          </Button>
        ))}

        {/* 下一页按钮 */}
        <IconButton
          aria-label="下一页"
          icon={<ChevronRightIcon />}
          size="sm"
          variant="outline"
          onClick={goToNextPage}
          isDisabled={!hasNextPage}
        />

        {/* 末页按钮 */}
        {!isMobile && !isLastPage && (
          <Button
            size="sm"
            variant="outline"
            onClick={goToLastPage}
          >
            末页
          </Button>
        )}
      </HStack>

      {/* 页面大小选择器 */}
      {showPageSizeSelector && onPageSizeChange && (
        <HStack justify="center" spacing={2}>
          <Text fontSize="sm" color="gray.600">
            每页显示:
          </Text>
          <Select
            size="sm"
            width="auto"
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} 项
              </option>
            ))}
          </Select>
        </HStack>
      )}
    </Box>
  );
};

export default Pagination;