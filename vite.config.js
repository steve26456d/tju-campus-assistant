import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    port: 3000,
    proxy: {
      "/api/tongji": {
        target: "https://api.tongji.edu.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tongji/, ""),
      },
      "/api/mcp": {
        target: "https://mcp.juhe.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mcp/, ""),
      },
      "/api/agent": {
        target: "https://agent.tongji.edu.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agent/, ""),
      },
    },
  },
})
