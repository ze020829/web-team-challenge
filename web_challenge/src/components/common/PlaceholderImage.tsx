import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface PlaceholderImageProps extends BoxProps {
  size?: string | number;
  text?: string;
  height?: string | number;
}

/**
 * 本地SVG占位符图片组件
 * 用于替代外部placeholder服务，避免网络依赖
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  size = '80px',
  text = 'No Image',
  height,
  ...boxProps
}) => {
  return (
    <Box
      width={size}
      height={height || size}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.200"
      borderRadius="md"
      {...boxProps}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="100"
          height="100"
          fill="#E2E8F0"
          rx="6"
        />
        <circle
          cx="50"
          cy="35"
          r="12"
          fill="#A0AEC0"
        />
        <path
          d="M25 75 C25 65, 35 55, 50 55 C65 55, 75 65, 75 75 L25 75 Z"
          fill="#A0AEC0"
        />
        <text
          x="50"
          y="90"
          textAnchor="middle"
          fontSize="8"
          fill="#718096"
          fontFamily="Arial, sans-serif"
        >
          {text}
        </text>
      </svg>
    </Box>
  );
};

export default PlaceholderImage;