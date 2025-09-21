/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除已弃用的 experimental.appDir 选项
  // Next.js 13.4+ 中 app 目录已经稳定，不再需要 experimental 标志
  
  images: {
    domains: ['s4.anilist.co'],
  },
  
  // 添加更好的错误处理和调试配置
  typescript: {
    // 在构建时忽略类型错误（可选）
    ignoreBuildErrors: false,
  },
  
  // 优化构建配置（swcMinify 在 Next.js 13+ 中默认启用，无需显式设置）
  
  // 添加重定向和重写规则以处理路由问题
  async rewrites() {
    return [
      // 确保 API 路由正确处理
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // 处理 Vite 客户端请求（开发环境）
      {
        source: '/@vite/:path*',
        destination: '/404',
      },
    ];
  },
  
  // 添加重定向规则
  async redirects() {
    return [
      // 重定向 Vite 客户端请求到 404 页面
      {
        source: '/@vite/client',
        destination: '/404',
        permanent: false,
      },
    ];
  },
  
  // 添加头部配置以改善网络请求
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;