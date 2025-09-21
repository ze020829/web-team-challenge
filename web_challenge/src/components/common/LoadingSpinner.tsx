'use client';

import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
  Center,
} from '@chakra-ui/react';

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  color?: string;
  thickness?: string;
  speed?: string;
  fullScreen?: boolean;
  minHeight?: string;
}

/**
 * 加载动画组件
 * 支持全屏和局部加载状态
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'lg',
  text = '加载中...',
  color = 'blue.500',
  thickness = '4px',
  speed = '0.65s',
  fullScreen = false,
  minHeight = '200px',
}) => {
  const content = (
    <VStack spacing={4}>
      <Spinner
        size={size}
        color={color}
        thickness={thickness}
        speed={speed}
      />
      {text && (
        <Text
          fontSize="sm"
          color="gray.600"
          textAlign="center"
        >
          {text}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="whiteAlpha.900"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </Box>
    );
  }

  return (
    <Center minHeight={minHeight}>
      {content}
    </Center>
  );
};

export default LoadingSpinner;