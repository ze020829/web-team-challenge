
# Web Team Challenge (v3.5)

## 目录
- [需要完成的步骤](#需要完成的步骤)  
- [我们会如何评估](#我们会如何评估)  
- [推荐的 GraphQL API（含图片）](#推荐的graphql-api含图片)  
- [提交要求](#提交要求)  

---

## 需要完成的步骤

- 请对你的代码进行适当的文档化。  
- 使用 **NextJS App router** 和 **TypeScript** 搭建一个项目。  
- 确保你的项目使用 **git** 管理。  
- 使用 **ChakraUI** 组件库来实现 UI 元素和样式。  
- 确保你的产品在 **移动端和桌面端自适应**。  
- 在站点中添加一个 **footer**，展示挑战版本号。  
- 添加一个 **阻挡元素**（页面 / modal / 等），在用户登录前阻止访问其他页面和数据：  
  - 在这个阻挡元素上，获取用户的 **username** 和 **job title**。  
  - 保存用户的 **username** 和 **job title** 信息（你可以自由决定保存方式），并保证数据在页面刷新后仍然存在。  
  - 一旦输入完成，用户必须能够完整查看该信息。  
  - 用户必须能够在提交后更改该信息。  

- 使用 **Apollo client** 查询一个 **公共 GraphQL API**：  
  - 确保选择的 GraphQL API 和数据结构包含 **images**。  
  - 确保数据显示并包含图片。  
  - 确保用户输入 **username** 和 **job title** 之前不能获取数据。  
  - 在 “Information Page” 上，以 **表格** 的形式展示 GraphQL API 数据。  
  - 用户必须能够通过 URL **直接链接**到分页数据的指定页面。  
  - 当用户在 “Information Page” 点击某一项时，必须打开一个 **modal**，展示该项的详细信息。  

- 使用 **Vercel free tier** 部署。  

- 我们倾向于尽可能少的使用依赖，请在完成测试时遵循该原则。  

---

## 我们会如何评估

我们将评估你在以下方面的能力：  
- **完成度**  
- **用户体验**  
- **可访问性**  
- **整体产品质量**

标准会按 **正式发布到生产环境的产品** 来考量。  

可以使用旧版本的依赖，例如 **Chakra 2** 或 **Next 14**来完成。  

---

## 推荐的 GraphQL API（含图片）

| 名称 | 描述 | GraphQL “Try It!” | 文档 / 仓库 |
|------|------|------------------|-------------|
| AniList | 提供 Anime 和 manga 数据，包括角色、工作人员和直播数据。 | [https://anilist.co/graphiql](https://anilist.co/graphiql) | [AniList Docs](https://anilist.gitbook.io/anilist-apiv2-docs/) |
| React Finland | React Finland API，专为会议和聚会设计。 | [https://api.react-finland.fi/graphql](https://api.react-finland.fi/graphql) | [GitHub](https://github.com/ReactFinland/graphql-api) |
| The Rick and Morty API | 提供所有 Rick and Morty 信息。 | [https://rickandmortyapi.com/graphql](https://rickandmortyapi.com/graphql) | [Docs](https://rickandmortyapi.com/documentation/#graphql) |

---

## 提交要求

请fork这个github项目，并确保我们能访问你的项目和相关代码。    

如有任何问题，请随时联系我们。  

**Good Luck！**
