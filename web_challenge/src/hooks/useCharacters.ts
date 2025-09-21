import { useState, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { 
  Character, 
  CharactersResponse, 
  CharacterResponse,
  GetCharactersVariables,
  GetCharacterVariables 
} from '@/types';
import { GET_CHARACTERS, GET_CHARACTER } from '@/lib/graphql-queries';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export interface UseCharactersReturn {
  characters: Character[];
  loading: boolean;
  error: string | null;
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  } | null;
  fetchCharacters: (page?: number, perPage?: number) => void;
  refetch: () => void;
}

export interface UseCharacterReturn {
  character: Character | null;
  loading: boolean;
  error: string | null;
  fetchCharacter: (id: number) => void;
}

/**
 * 角色列表数据获取 Hook
 * @param initialPage 初始页码
 * @param initialPerPage 初始每页数量
 */
export const useCharacters = (
  initialPage: number = 1,
  initialPerPage: number = DEFAULT_PAGE_SIZE
): UseCharactersReturn => {
  const [variables, setVariables] = useState<GetCharactersVariables>({
    page: initialPage,
    perPage: initialPerPage,
  });

  const { data, loading, error, refetch } = useQuery<CharactersResponse, GetCharactersVariables>(
    GET_CHARACTERS,
    {
      variables,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  const fetchCharacters = useCallback((page?: number, perPage?: number) => {
    const newVariables: GetCharactersVariables = {
      page: page || initialPage,
      perPage: perPage || initialPerPage,
    };
    
    setVariables(newVariables);
  }, [initialPage, initialPerPage]);

  return {
    characters: data?.Page?.characters || [],
    loading,
    error: error?.message || null,
    pageInfo: data?.Page?.pageInfo || null,
    fetchCharacters,
    refetch,
  };
};

/**
 * 单个角色详情数据获取 Hook
 */
export const useCharacter = (): UseCharacterReturn => {
  const [fetchCharacter, { data, loading, error }] = useLazyQuery<CharacterResponse, GetCharacterVariables>(
    GET_CHARACTER,
    {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    }
  );

  const handleFetchCharacter = useCallback((id: number) => {
    fetchCharacter({ variables: { id } });
  }, [fetchCharacter]);

  return {
    character: data?.Character || null,
    loading,
    error: error?.message || null,
    fetchCharacter: handleFetchCharacter,
  };
};

/**
 * 分页逻辑 Hook
 * @param totalPages 总页数
 * @param currentPage 当前页码
 * @param onPageChange 页码变化回调
 */
export const usePagination = (
  totalPages: number,
  currentPage: number,
  onPageChange: (page: number) => void
) => {
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  }, [totalPages, currentPage, onPageChange]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  return {
    goToPage,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};