'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client/react/context';
import { usePathname } from 'next/navigation';
import { Box, Flex } from '@chakra-ui/react';
import apolloClient from '@/lib/apollo-client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthGuard } from '@/components/common/AuthGuard';

import { ROUTES } from '@/utils/constants';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// 应用内容组件
function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 不需要认证的页面路径
  const publicPaths = [ROUTES.LOGIN];
  const isPublicPath = publicPaths.includes(pathname as typeof ROUTES.LOGIN);

  return (
    <Flex direction="column" minHeight="100vh">
      {/* 只在非登录页面显示Header */}
      {!isPublicPath && <Header />}
      
      <Box flex={1} as="main">
        {isPublicPath ? (
          // 公开页面不需要认证保护
          children
        ) : (
          // 受保护的页面需要认证
          <AuthGuard>
            {children}
          </AuthGuard>
        )}
      </Box>
      
      {/* 只在非登录页面显示Footer */}
      {!isPublicPath && <Footer />}
    </Flex>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ApolloProvider client={apolloClient}>
          <ChakraProvider>
            <AppContent>{children}</AppContent>
          </ChakraProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}