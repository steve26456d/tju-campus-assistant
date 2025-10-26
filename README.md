# 同济校园生活辅助系统

一个基于Vue 3 + JSX的mashup应用，整合同济大学官方API、第三方服务和AI助手。

## 功能特性

- 📅 学生课程表查询
- 💳 一卡通流水记录
- 🌤️ 天气预报（聚合MCP Server）
- 🗺️ 路线规划（百度地图API）
- 🤖 AI学习助手（qwen3-max）

## 技术栈

- Vue 3 + JSX
- Vue Router
- Pinia (状态管理)
- Axios (HTTP客户端)
- Tailwind CSS
- Vite

## 开发指南


### 安装依赖

```bash
npm install
```

### 进入server文件夹，运行模拟后端服务器
```bash
cd ./server
npm init -y
npm install
node server.js
```
### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## API集成

### 同济大学API
- 学生基本信息: `/v2/dc/user/student_infos`
- 一卡通流水: `/v1/dc/card/card_history_flow`
- 学生课表: `/v1/rt/onetongji/student_timetable`

### 第三方API
- 天气预报MCP Server: `https://mcp.juhe.cn/sse`
- 百度地图路线规划: JS API GL
- AI Agent: `https://dashscope.aliyuncs.com/compatible-mode/v1`

## 项目结构

```
src/
├── views/          # 页面组件
├── layouts/        # 布局组件
├── stores/         # Pinia状态管理
├── router/         # 路由配置
├── utils/          # 工具函数
└── main.js         # 应用入口
```