"use client"

import { ref, onMounted } from "vue"
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const initializeClient = async (client) => {
  const mcpClient = new Client({
    name: "weather-report",
    version: "1.0.0"
  })
  const transport = new SSEClientTransport(new URL(`http://localhost:3000/api/sse?token=${import.meta.env.VITE_MCP_SERVER_TOKEN}`))
  console.log("mcpClient: ",mcpClient)
  console.log("Transport: ",transport)
  try {
    console.log("Connecting to MCP...");
    // 正确处理连接
    await mcpClient.connect(transport);
    console.log("连接成功");
    client.value = mcpClient;
  } catch (error) {
    console.error("连接失败:", error);
  }
};

const callToolWeather = async (client) => {
  if(!client.value)
    return
  try{
    const result = await client.value.callTool({
      name: "get_weather",
      arguments: {
        city: "上海"
      }
    })
    console.log(JSON.parse(result.content[0].text))
    return result

  } catch(error){
    console.log("callToolWeather Error:",error)
  }
}

const divideApiLevel = (api) => {
  switch(api){
    case api <= 50:
      return '优'
    case api > 50 && api <= 100:
      return '良'
    case api > 100 && api <= 150:
      return '轻度污染'
    case api > 150 && api <= 200:
      return '中度污染'
    case api > 200 && api <= 300:
      return '重度污染'
    case api > 300:
      return '严重污染'
  }
}

export default {
  name: "Weather",
  setup() {
    const realTimeWeather = ref(null)
    const forecast = ref([])
    const todayWeather = ref(null)
    const loading = ref(true)
    const error = ref("")
    const city = ref("上海")
    const client = ref(null)

    const fetchWeather = async () => {
      loading.value = true
      error.value = ""

      try {
        if(client.value)
          client.value.close()

        await initializeClient(client)

        console.log("client: ",client)

        const r = await callToolWeather(client)

        const data = JSON.parse(r.content[0].text).result

        realTimeWeather.value = data.realtime

        forecast.value = data.future

        todayWeather.value = forecast.value[0]

      } catch (err) {
        console.error("Failed to fetch weather:", err)
        error.value = "获取天气信息失败，请稍后重试"
        loading.value = false
      } finally {
        loading.value = false
      }
    }

    const getWeatherIcon = (info) => {
      const icons = {
        晴: "☀️",
        多云: "☁️",
        阴: "🌥️",
        小雨: "🌧️",
        中雨: "🌧️",
        大雨: "⛈️",
        雪: "❄️",
        雾: "🌫️",
      }
      return icons[info] || "🌤️"
    }

    const getAQIColor = (aqi) => {
      if (aqi <= 50) return "text-green-600 bg-green-100"
      if (aqi <= 100) return "text-yellow-600 bg-yellow-100"
      if (aqi <= 150) return "text-orange-600 bg-orange-100"
      if (aqi <= 200) return "text-red-600 bg-red-100"
      return "text-purple-600 bg-purple-100"
    }

    const getTemperatureColor = (temp) => {
      if (temp >= 30) return "text-red-600"
      if (temp >= 20) return "text-orange-600"
      if (temp >= 10) return "text-blue-600"
      return "text-cyan-600"
    }

    onMounted(() => {
      fetchWeather()
    })

    // Cleanup on unmount
    const cleanup = () => {
      if (eventSource.value) {
        eventSource.value.close()
      }
    }

    return () => (
      <div class="space-y-6">
        {/* Header */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-text">天气预报</h2>
              <p class="text-text-secondary mt-1">实时天气与未来预报</p>
            </div>
            <button
              onClick={fetchWeather}
              class="self-start sm:self-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              刷新天气
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading.value && (
          <div class="bg-white rounded-xl shadow-sm p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p class="mt-4 text-text-secondary">加载天气数据中...</p>
          </div>
        )}

        {/* Error State */}
        {error.value && !loading.value && (
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="font-medium text-red-800">{error.value}</p>
                <p class="text-sm text-red-600 mt-1">显示模拟数据用于演示</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Weather */}
        {!loading.value && realTimeWeather.value && (
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div class="flex items-center gap-6">
                <div class="text-7xl">{getWeatherIcon(realTimeWeather.value.info)}</div>
                <div>
                  <div class="text-5xl font-bold mb-2">
                    <span class={getTemperatureColor(realTimeWeather.value.temperature)}>
                      {realTimeWeather.value.temperature}°C
                    </span>
                  </div>
                  <div class="text-xl mb-1">{realTimeWeather.value.info}</div>
                  <div class="text-xs opacity-75 mt-2">
                    {city.value} · {todayWeather.value.date}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div class="text-sm opacity-90 mb-1">湿度</div>
                  <div class="text-2xl font-bold">{realTimeWeather.value.humidity}%</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div class="text-sm opacity-90 mb-1">风速</div>
                  <div class="text-2xl font-bold">{realTimeWeather.value.power}</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm col-span-2">
                  <div class="text-sm opacity-90 mb-1">空气质量</div>
                  <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold">{realTimeWeather.value.aqi}</div>
                    <div class={`px-3 py-1 rounded-full text-sm font-medium ${getAQIColor(parseInt(realTimeWeather.value.aqi))}`}>
                      {divideApiLevel(parseInt(realTimeWeather.value.aqi))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {!loading.value && forecast.value.length > 0 && (
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-border">
              <h3 class="text-lg font-semibold text-text">未来5天预报</h3>
            </div>

            {/* Desktop View */}
            <div class="hidden md:grid md:grid-cols-5 divide-x divide-border">
              {forecast.value.map((day, index) => (
                <div key={index} class="p-4 text-center hover:bg-surface transition-colors">
                  <div class="text-sm font-medium text-text mb-2">{day.date}</div>
                  {/* <div class="text-xs text-text-secondary mb-3">{day.day}</div> */}
                  <div class="text-4xl mb-3">{getWeatherIcon(day.weather)}</div>
                  <div class="text-sm text-text-secondary mb-2">{day.weather}</div>
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-red-600 font-semibold">{day.temperature}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View */}
            <div class="md:hidden divide-y divide-border">
              {forecast.value.map((day, index) => (
                <div key={index} class="p-4 flex items-center justify-between hover:bg-surface transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="text-3xl">{getWeatherIcon(day.weather)}</div>
                    <div>
                      <div class="font-medium text-text">{day.date}</div>
                      {/* <div class="text-sm text-text-secondary">{day.day}</div> */}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-text-secondary mb-1">{day.weather}</div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-600 font-semibold">{day.temperature}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Tips */}
        {!loading.value && realTimeWeather.value && (
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-text mb-4">生活建议</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex items-start gap-3 p-4 bg-surface rounded-lg">
                <div class="text-2xl">👕</div>
                <div>
                  <div class="font-medium text-text mb-1">穿衣指数</div>
                  <div class="text-sm text-text-secondary">
                    {parseInt(realTimeWeather.value.temperature) > 20
                      ? "适合穿短袖"
                      : parseInt(realTimeWeather.value.temperature) > 15
                        ? "适合穿长袖"
                        : "建议穿外套"}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-surface rounded-lg">
                <div class="text-2xl">🏃</div>
                <div>
                  <div class="font-medium text-text mb-1">运动指数</div>
                  <div class="text-sm text-text-secondary">
                    {parseInt(realTimeWeather.value.aqi) < 100 ? "适宜户外运动" : "建议室内运动"}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-surface rounded-lg">
                <div class="text-2xl">☂️</div>
                <div>
                  <div class="font-medium text-text mb-1">出行建议</div>
                  <div class="text-sm text-text-secondary">
                    {realTimeWeather.value.info.includes("雨") ? "记得带伞" : "无需带伞"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MCP Server Info */}
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div class="flex items-start gap-3">
            <div class="text-2xl">ℹ️</div>
            <div>
              <div class="font-medium text-blue-900 mb-1">天气数据来源</div>
              <div class="text-sm text-blue-700">
                本页面使用聚合MCP Server提供的天气预报服务（SSE连接）。实际部署时需要配置正确的MCP Server连接地址。
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
