# 部署指南

## Vue项目本地运行

这是一个完整的Vue 3 + JSX项目。要在本地运行：

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置API密钥

在 `index.html` 中配置百度地图AK：

\`\`\`html
<script src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak=YOUR_BAIDU_MAP_AK"></script>
\`\`\`

### 3. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 4. 构建生产版本

\`\`\`bash
npm run build
\`\`\`

## 项目结构

\`\`\`
tongji-campus-assistant/
├── src/
│   ├── views/          # 页面组件
│   │   ├── Login.jsx
│   │   ├── Schedule.jsx
│   │   ├── CardHistory.jsx
│   │   ├── Weather.jsx
│   │   ├── MapPlanning.jsx
│   │   └── AIChat.jsx
│   ├── layouts/        # 布局组件
│   │   └── MainLayout.jsx
│   ├── stores/         # Pinia状态管理
│   │   └── auth.js
│   ├── router/         # 路由配置
│   │   └── index.js
│   ├── utils/          # 工具函数
│   │   └── api.js
│   ├── App.jsx         # 根组件
│   ├── main.js         # 应用入口
│   └── style.css       # 全局样式
├── index.html          # HTML模板
├── vite.config.js      # Vite配置
├── tailwind.config.js  # Tailwind配置
└── package.json        # 项目依赖
\`\`\`

## API配置

### 同济大学API

需要配置统一身份认证token：

- 学生信息: `https://api.tongji.edu.cn/v2/dc/user/student_infos`
- 一卡通流水: `https://api.tongji.edu.cn/v1/dc/card/card_history_flow`
- 学生课表: `https://api.tongji.edu.cn/v1/rt/onetongji/student_timetable`

### 第三方API

- **天气预报**: 聚合MCP Server `https://mcp.juhe.cn/sse`
- **地图服务**: 百度地图JS API GL (需要AK密钥)
- **AI助手**: 同济Agent平台 `https://agent.tongji.edu.cn/api/proxy/api/v1`

## 功能特性

1. **统一身份认证** - 使用同济大学统一身份认证登录
2. **课程表查询** - 查看本学期课程安排，支持周次切换
3. **一卡通流水** - 查看消费记录和余额信息
4. **天气预报** - 实时天气与7天预报
5. **路线规划** - 校园导航与出行规划
6. **AI学习助手** - 基于Deepseek-R1的智能问答

## 注意事项

- 本项目使用Vue 3 + JSX语法
- 所有API调用都通过Vite代理配置，避免跨域问题
- 实际部署时需要配置正确的API密钥和认证token
- 地图功能需要有效的百度地图AK密钥
\`\`\`
