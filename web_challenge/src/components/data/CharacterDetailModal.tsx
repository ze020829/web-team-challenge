'use client';

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Box,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import { StarIcon, CalendarIcon, ViewIcon } from '@chakra-ui/icons';
import { Character } from '@/types';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';

export interface CharacterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  loading?: boolean;
}

/**
 * 角色详情模态框组件
 * 展示角色的完整详细信息，包括基本信息、描述、相关作品等
 */
export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  isOpen,
  onClose,
  character,
  loading = false,
}) => {
  const imageSize = useBreakpointValue({ base: '200px', md: '300px' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 强制清理DOM元素
  useEffect(() => {
    if (!isOpen) {
      // 模态框关闭时，强制清理可能残留的DOM元素
      const cleanup = () => {
        const modalElements = document.querySelectorAll('[data-chakra-modal]');
        modalElements.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
        
        // 清理可能的遮罩层
        const overlayElements = document.querySelectorAll('.chakra-modal__overlay');
        overlayElements.forEach(element => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
        
        // 恢复body滚动
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        console.log('CharacterDetailModal: 强制清理DOM完成');
      };
      
      // 延迟清理，确保动画完成
      const timer = setTimeout(cleanup, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      // 组件卸载时强制清理
      const modalElements = document.querySelectorAll('[data-chakra-modal]');
      modalElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      console.log('CharacterDetailModal: 组件卸载清理完成');
    };
  }, []);

  // 格式化生日
  const formatBirthDate = (dateOfBirth?: {
    year?: number;
    month?: number;
    day?: number;
  }): string => {
    if (!dateOfBirth) return '未知';
    const { year, month, day } = dateOfBirth;
    if (year && month && day) {
      return `${year}年${month}月${day}日`;
    }
    if (year && month) {
      return `${year}年${month}月`;
    }
    if (year) {
      return `${year}年`;
    }
    return '未知';
  };

  // 格式化描述文本
  const formatDescription = (description?: string): string => {
    if (!description) return '暂无描述';
    // 移除 HTML 标签
    return description.replace(/<[^>]*>/g, '');
  };

  // 获取角色统计信息
  const getCharacterStats = () => {
    if (!character) return [];
    
    const stats = [
      {
        label: '收藏数',
        value: character.favourites?.toLocaleString() || '0',
        icon: StarIcon,
        color: 'yellow.500',
      },
    ];

    if (character.media?.nodes?.length) {
      stats.push({
        label: '相关作品',
        value: character.media.nodes.length.toString(),
        icon: ViewIcon,
        color: 'blue.500',
      });
    }

    return stats;
  };

  // 渲染加载状态
  const renderLoadingContent = () => (
    <VStack spacing={6} align="stretch">
      <Grid templateColumns={{ base: '1fr', md: 'auto 1fr' }} gap={6}>
        <GridItem>
          <Skeleton width={imageSize} height={imageSize} borderRadius="lg" />
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={4}>
            <Skeleton height="32px" width="200px" />
            <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
            <HStack spacing={2}>
              <Skeleton height="24px" width="60px" borderRadius="full" />
              <Skeleton height="24px" width="60px" borderRadius="full" />
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
      <SkeletonText mt="4" noOfLines={6} spacing="4" skeletonHeight="2" />
    </VStack>
  );

  // 渲染角色基本信息
  const renderBasicInfo = () => {
    if (!character) return null;

    return (
      <Grid templateColumns={{ base: '1fr', md: 'auto 1fr' }} gap={6}>
        <GridItem>
          {character.image?.large || character.image?.medium ? (
            <Image
              src={character.image.large || character.image.medium}
              alt={character.name?.full}
              width={imageSize}
              height="auto"
              objectFit="cover"
              borderRadius="lg"
              shadow="lg"
              fallback={
                <PlaceholderImage
                  size={imageSize}
                  text="角色头像"
                  borderRadius="lg"
                />
              }
            />
          ) : (
            <PlaceholderImage
              size={imageSize}
              text="角色头像"
              borderRadius="lg"
            />
          )}
        </GridItem>
        
        <GridItem>
          <VStack align="start" spacing={4}>
            {/* 姓名信息 */}
            <Box>
              <Heading size="xl" mb={2} color="gray.800">
                {character.name?.full}
              </Heading>
              {character.name?.native && (
                <Text fontSize="lg" color="gray.600" mb={1}>
                  {character.name.native}
                </Text>
              )}
              {character.name?.alternative && character.name.alternative.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  别名: {character.name.alternative.join(', ')}
                </Text>
              )}
            </Box>
            
            {/* 基本属性标签 */}
            <Wrap spacing={2}>
              {character.gender && (
                <WrapItem>
                  <Badge colorScheme="blue" size="lg" px={3} py={1}>
                    {character.gender}
                  </Badge>
                </WrapItem>
              )}
              {character.age && (
                <WrapItem>
                  <Badge colorScheme="green" size="lg" px={3} py={1}>
                    {character.age}岁
                  </Badge>
                </WrapItem>
              )}
              {character.bloodType && (
                <WrapItem>
                  <Badge colorScheme="red" size="lg" px={3} py={1}>
                    {character.bloodType}型血
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
            
            {/* 详细信息 */}
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={CalendarIcon} color="gray.500" />
                <Text fontWeight="semibold" minW="60px">生日:</Text>
                <Text>{formatBirthDate(character.dateOfBirth)}</Text>
              </HStack>
            </VStack>

            {/* 统计信息 */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
              {getCharacterStats().map((stat, index) => (
                <Stat key={index}>
                  <StatLabel>
                    <HStack>
                      <Icon as={stat.icon} color={stat.color} />
                      <Text>{stat.label}</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                </Stat>
              ))}
            </SimpleGrid>
          </VStack>
        </GridItem>
      </Grid>
    );
  };

  // 渲染角色描述
  const renderDescription = () => {
    if (!character?.description) return null;

    return (
      <Card>
        <CardHeader>
          <Heading size="md">角色描述</Heading>
        </CardHeader>
        <CardBody>
          <Text lineHeight="1.8" color="gray.700">
            {formatDescription(character.description)}
          </Text>
        </CardBody>
      </Card>
    );
  };

  // 渲染相关作品
  const renderRelatedMedia = () => {
    if (!character?.media?.nodes || character.media.nodes.length === 0) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <Heading size="md">
            相关作品 ({character.media.nodes.length})
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 4 }}
            spacing={4}
          >
            {character.media.nodes.map((media) => (
              <Box
                key={media.id}
                borderWidth={1}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                {media.coverImage?.medium || media.coverImage?.large ? (
                  <Image
                    src={media.coverImage.medium || media.coverImage.large}
                    alt={media.title?.english || media.title?.romaji}
                    width="100%"
                    height="140px"
                    objectFit="cover"
                    fallback={
                      <PlaceholderImage
                        size="100%"
                        height="140px"
                        text="作品封面"
                        borderRadius="0"
                      />
                    }
                  />
                ) : (
                  <PlaceholderImage
                    size="100%"
                    height="140px"
                    text="作品封面"
                    borderRadius="0"
                  />
                )}
                
                <Box p={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    noOfLines={2}
                    mb={2}
                    minHeight="40px"
                  >
                    {media.title?.english || media.title?.romaji || media.title?.native}
                  </Text>
                  
                  <HStack spacing={1} wrap="wrap" mb={2}>
                    <Badge size="sm" colorScheme="purple">
                      {media.type}
                    </Badge>
                    {media.format && (
                      <Badge size="sm" variant="outline">
                        {media.format}
                      </Badge>
                    )}
                  </HStack>
                  
                  {media.status && (
                    <Text fontSize="xs" color="gray.500">
                      {media.status}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    );
  };

  // 增强的关闭处理函数
  const handleClose = () => {
    console.log('CharacterDetailModal: 开始执行关闭操作');
    
    // 立即调用onClose
    onClose();
    
    // 强制清理DOM元素
    setTimeout(() => {
      const modalElements = document.querySelectorAll('[data-chakra-modal]');
      modalElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      
      // 清理遮罩层
      const overlayElements = document.querySelectorAll('.chakra-modal__overlay');
      overlayElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      
      console.log('CharacterDetailModal: 关闭操作和DOM清理完成');
    }, 100);
  };

  // 使用character.id作为key强制重新渲染
  const modalKey = character ? `modal-${character.id}-${isOpen}` : `modal-empty-${isOpen}`;
  
  return (
    <Modal
      key={modalKey}
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={true}
      closeOnEsc={true}
      scrollBehavior="inside"
      isCentered={!isMobile}
      motionPreset="slideInBottom"
      preserveScrollBarGap={true}
      blockScrollOnMount={true}
      trapFocus={true}
      returnFocusOnClose={true}
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        width={{ base: "100vw", md: "900px" }}
        height={{ base: "100vh", md: "700px" }}
        maxWidth={{ base: "100vw", md: "900px" }}
        maxHeight={{ base: "100vh", md: "700px" }}
        mx={{ base: 0, md: "auto" }}
        my={{ base: 0, md: "auto" }}
      >
        <ModalHeader pb={2}>
          <Text fontSize="xl" fontWeight="bold">
            {loading ? '加载中...' : character?.name?.full || '角色详情'}
          </Text>
        </ModalHeader>
        
        <ModalCloseButton 
          size="lg"
          onClick={handleClose}
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
        />
        
        <ModalBody pb={6} overflowY="auto" flex="1">
          {loading ? (
            renderLoadingContent()
          ) : character ? (
            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>基本信息</Tab>
                <Tab>详细描述</Tab>
                <Tab>相关作品</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {renderBasicInfo()}
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  {renderDescription()}
                </TabPanel>
                
                <TabPanel px={0}>
                  {renderRelatedMedia()}
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">未找到角色信息</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CharacterDetailModal;