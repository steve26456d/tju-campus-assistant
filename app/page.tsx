"use client"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">同济校园生活辅助系统</h1>
          <p className="text-xl text-gray-600 mb-2">Tongji Campus Assistant</p>
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Vue 3 + JSX Mashup Application
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">项目概述</h2>
            <p className="leading-relaxed">
              这是一个基于Vue 3 +
              JSX的mashup应用，整合了同济大学官方API、第三方服务和AI助手，为学生提供全方位的校园生活辅助。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">学生课程表</h3>
              <p className="text-sm text-gray-600">查询本学期课程安排，支持周次切换和课程统计</p>
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">一卡通流水</h3>
              <p className="text-sm text-gray-600">查看消费记录、余额信息和消费分类统计</p>
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🌤️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">天气预报</h3>
              <p className="text-sm text-gray-600">实时天气与7天预报（聚合MCP Server）</p>
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">路线规划</h3>
              <p className="text-sm text-gray-600">校园导航与出行规划（百度地图API）</p>
            </div>

            <div className="border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow md:col-span-2">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">AI学习助手</h3>
              <p className="text-sm text-gray-600">基于Deepseek-R1模型的智能问答助手</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">技术栈</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 text-center font-medium">Vue 3</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">JSX</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">Vue Router</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">Pinia</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">Axios</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">Tailwind CSS</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">Vite</div>
              <div className="bg-white rounded-lg p-3 text-center font-medium">TypeScript</div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">API集成</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <div>
                  <span className="font-semibold">同济大学API：</span>
                  <span className="text-gray-700"> 学生信息、一卡通流水、课程表</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <div>
                  <span className="font-semibold">天气服务：</span>
                  <span className="text-gray-700"> 聚合MCP Server (SSE连接)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <div>
                  <span className="font-semibold">地图服务：</span>
                  <span className="text-gray-700"> 百度地图JS API GL</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <div>
                  <span className="font-semibold">AI服务：</span>
                  <span className="text-gray-700"> 同济Agent平台 Deepseek-R1</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">部署说明</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">1. 安装依赖：</span> 运行{" "}
                <code className="bg-white px-2 py-1 rounded">npm install</code>
              </p>
              <p>
                <span className="font-semibold">2. 启动开发：</span> 运行{" "}
                <code className="bg-white px-2 py-1 rounded">npm run dev</code>
              </p>
              <p>
                <span className="font-semibold">3. 配置API：</span> 在index.html中配置百度地图AK密钥
              </p>
              <p>
                <span className="font-semibold">4. 认证配置：</span> 配置同济统一身份认证和各API的token
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600 mb-4">完整的Vue项目文件已生成，请下载ZIP或推送到GitHub进行部署</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                下载项目文件
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors">
                推送到GitHub
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>同济大学校园生活辅助系统 © 2025</p>
          <p className="mt-1">Mashup-based Application · Vue 3 + JSX</p>
        </div>
      </div>
    </div>
  )
}
