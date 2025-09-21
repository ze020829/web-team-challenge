'use client';

import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Card,
  CardBody,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from '@chakra-ui/react';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { Character } from '@/types';

export interface CharacterTableProps {
  characters: Character[];
  loading?: boolean;
  onCharacterClick?: (character: Character) => void;
}

/**
 * 角色数据表格组件
 * 支持桌面端表格和移动端卡片布局
 */
export const CharacterTable: React.FC<CharacterTableProps> = ({
  characters,
  loading = false,
  onCharacterClick,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // 获取角色的主要媒体作品
  const getPrimaryMedia = (character: Character): string => {
    const media = character.media?.nodes?.[0];
    if (!media) return '未知';
    
    return media.title?.english || media.title?.romaji || media.title?.native || '未知';
  };

  // 格式化描述文本
  const formatDescription = (description?: string): string => {
    if (!description) return '暂无描述';
    
    // 移除 HTML 标签并限制长度
    const plainText = description.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText;
  };

  // 加载状态
  if (loading) {
    return (
      <Box>
        {isMobile ? (
          // 移动端加载状态
          <VStack spacing={4}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} width="full">
                <CardBody>
                  <HStack spacing={4}>
                    <Skeleton height="80px" width="60px" borderRadius="md" />
                    <VStack align="start" flex={1} spacing={2}>
                      <Skeleton height="20px" width="60%" />
                      <Skeleton height="16px" width="40%" />
                      <SkeletonText noOfLines={2} spacing={1} />
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        ) : (
          // 桌面端加载状态
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>头像</Th>
                  <Th>姓名</Th>
                  <Th>性别</Th>
                  <Th>年龄</Th>
                  <Th>主要作品</Th>
                  <Th>描述</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <Skeleton height="60px" width="45px" borderRadius="md" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="80px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="40px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="30px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="120px" />
                    </Td>
                    <Td>
                      <SkeletonText noOfLines={2} spacing={1} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  }

  // 空状态
  if (!characters || characters.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">
          暂无数据
        </Text>
      </Box>
    );
  }

  // 移动端卡片布局
  if (isMobile) {
    return (
      <VStack spacing={4}>
        {characters.map((character) => (
          <Card
            key={character.id}
            width="full"
            cursor={onCharacterClick ? 'pointer' : 'default'}
            onClick={() => onCharacterClick?.(character)}
            _hover={onCharacterClick ? { shadow: 'md', transform: 'translateY(-2px)' } : {}}
            transition="all 0.2s"
          >
            <CardBody>
              <HStack spacing={4} align="start">
                {character.image?.medium || character.image?.large ? (
                  <Image
                    src={character.image.medium || character.image.large}
                    alt={character.name?.full}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    fallback={<PlaceholderImage size="80px" text="No Image" />}
                  />
                ) : (
                  <PlaceholderImage size="80px" text="No Image" />
                )}
                
                <VStack align="start" flex={1} spacing={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    {character.name?.full}
                  </Text>
                  
                  <HStack spacing={2} wrap="wrap">
                    {character.gender && (
                      <Badge colorScheme="blue" size="sm">
                        {character.gender}
                      </Badge>
                    )}
                    {character.age && (
                      <Badge colorScheme="green" size="sm">
                        {character.age}岁
                      </Badge>
                    )}
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.600">
                    主要作品: {getPrimaryMedia(character)}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.500" noOfLines={2}>
                    {formatDescription(character.description)}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    );
  }

  // 桌面端表格布局
  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>头像</Th>
            <Th>姓名</Th>
            <Th>性别</Th>
            <Th>年龄</Th>
            <Th>主要作品</Th>
            <Th>描述</Th>
          </Tr>
        </Thead>
        <Tbody>
          {characters.map((character) => (
            <Tr
              key={character.id}
              cursor={onCharacterClick ? 'pointer' : 'default'}
              onClick={() => onCharacterClick?.(character)}
              _hover={onCharacterClick ? { bg: 'gray.50' } : {}}
              transition="background-color 0.2s"
            >
              <Td>
                {character.image?.medium || character.image?.large ? (
                  <Image
                    src={character.image.medium || character.image.large}
                    alt={character.name?.full}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                    fallback={<PlaceholderImage size="60px" text="No Image" />}
                  />
                ) : (
                  <PlaceholderImage size="60px" text="No Image" />
                )}
              </Td>
              
              <Td>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">
                    {character.name?.full}
                  </Text>
                  {character.name?.native && (
                    <Text fontSize="sm" color="gray.500">
                      {character.name.native}
                    </Text>
                  )}
                </VStack>
              </Td>
              
              <Td>
                {character.gender ? (
                  <Badge colorScheme="blue">
                    {character.gender}
                  </Badge>
                ) : (
                  <Text color="gray.400">未知</Text>
                )}
              </Td>
              
              <Td>
                {character.age ? (
                  <Badge colorScheme="green">
                    {character.age}岁
                  </Badge>
                ) : (
                  <Text color="gray.400">未知</Text>
                )}
              </Td>
              
              <Td>
                <Text fontSize="sm" maxW="200px" noOfLines={2}>
                  {getPrimaryMedia(character)}
                </Text>
              </Td>
              
              <Td>
                <Text fontSize="sm" color="gray.600" maxW="300px" noOfLines={3}>
                  {formatDescription(character.description)}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CharacterTable;