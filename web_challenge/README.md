# Next.js GraphQL 数据展示平台

基于 Next.js + TypeScript 的动漫角色数据展示平台，集成用户信息验证和 GraphQL 数据查询。

## 技术栈

- **框架**: Next.js 14 + React 18 + TypeScript
- **UI**: Chakra UI + Tailwind CSS
- **数据**: Apollo Client + GraphQL (AniList API)

## 主要功能

- 用户信息验证机制
- 动漫角色数据展示和分页
- 响应式设计
- 角色详情模态框

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://graphql.anilist.co
```

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
│   ├── layout/            # 布局组件
│   ├── user/              # 用户相关组件
│   ├── data/              # 数据展示组件
│   └── common/            # 通用组件
├── hooks/                 # 自定义 Hooks
├── lib/                   # 工具库配置
├── types/                 # TypeScript 类型
└── utils/                 # 工具函数
```
