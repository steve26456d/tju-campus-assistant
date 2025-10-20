"use client"

import { ref, onMounted } from "vue"

export default {
  name: "Weather",
  setup() {
    const currentWeather = ref(null)
    const forecast = ref([])
    const loading = ref(true)
    const error = ref("")
    const city = ref("上海")
    const eventSource = ref(null)

    const fetchWeather = async () => {
      loading.value = true
      error.value = ""

      try {
        // 使用SSE连接聚合MCP Server
        if (eventSource.value) {
          eventSource.value.close()
        }

        // 注意：实际使用时需要配置正确的MCP Server连接
        // eventSource.value = new EventSource(`https://mcp.juhe.cn/sse?city=${city.value}`)

        // eventSource.value.onmessage = (event) => {
        //   const data = JSON.parse(event.data)
        //   currentWeather.value = data.current
        //   forecast.value = data.forecast
        //   loading.value = false
        // }

        // eventSource.value.onerror = (err) => {
        //   console.error('SSE connection error:', err)
        //   error.value = '天气数据连接失败'
        //   loading.value = false
        // }

        // 模拟数据用于演示
        setTimeout(() => {
          currentWeather.value = {
            temperature: 8,
            feelsLike: 5,
            condition: "多云",
            humidity: 65,
            windSpeed: 12,
            windDirection: "东北风",
            aqi: 85,
            aqiLevel: "良",
            updateTime: "2025-01-20 14:30",
          }

          forecast.value = [
            {
              date: "今天",
              day: "周一",
              high: 10,
              low: 5,
              condition: "多云",
              icon: "☁️",
            },
            {
              date: "明天",
              day: "周二",
              high: 12,
              low: 6,
              condition: "晴",
              icon: "☀️",
            },
            {
              date: "01/22",
              day: "周三",
              high: 11,
              low: 4,
              condition: "阴",
              icon: "🌥️",
            },
            {
              date: "01/23",
              day: "周四",
              high: 9,
              low: 3,
              condition: "小雨",
              icon: "🌧️",
            },
            {
              date: "01/24",
              day: "周五",
              high: 13,
              low: 7,
              condition: "晴",
              icon: "☀️",
            },
            {
              date: "01/25",
              day: "周六",
              high: 14,
              low: 8,
              condition: "多云",
              icon: "⛅",
            },
            {
              date: "01/26",
              day: "周日",
              high: 12,
              low: 6,
              condition: "晴",
              icon: "☀️",
            },
          ]

          loading.value = false
        }, 1000)
      } catch (err) {
        console.error("Failed to fetch weather:", err)
        error.value = "获取天气信息失败，请稍后重试"
        loading.value = false
      }
    }

    const getWeatherIcon = (condition) => {
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
      return icons[condition] || "🌤️"
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
        {!loading.value && currentWeather.value && (
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div class="flex items-center gap-6">
                <div class="text-7xl">{getWeatherIcon(currentWeather.value.condition)}</div>
                <div>
                  <div class="text-5xl font-bold mb-2">
                    <span class={getTemperatureColor(currentWeather.value.temperature)}>
                      {currentWeather.value.temperature}°C
                    </span>
                  </div>
                  <div class="text-xl mb-1">{currentWeather.value.condition}</div>
                  <div class="text-sm opacity-90">体感温度 {currentWeather.value.feelsLike}°C</div>
                  <div class="text-xs opacity-75 mt-2">
                    {city.value} · {currentWeather.value.updateTime}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div class="text-sm opacity-90 mb-1">湿度</div>
                  <div class="text-2xl font-bold">{currentWeather.value.humidity}%</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div class="text-sm opacity-90 mb-1">风速</div>
                  <div class="text-2xl font-bold">{currentWeather.value.windSpeed}km/h</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm col-span-2">
                  <div class="text-sm opacity-90 mb-1">空气质量</div>
                  <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold">{currentWeather.value.aqi}</div>
                    <div class={`px-3 py-1 rounded-full text-sm font-medium ${getAQIColor(currentWeather.value.aqi)}`}>
                      {currentWeather.value.aqiLevel}
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
              <h3 class="text-lg font-semibold text-text">未来7天预报</h3>
            </div>

            {/* Desktop View */}
            <div class="hidden md:grid md:grid-cols-7 divide-x divide-border">
              {forecast.value.map((day, index) => (
                <div key={index} class="p-4 text-center hover:bg-surface transition-colors">
                  <div class="text-sm font-medium text-text mb-2">{day.date}</div>
                  <div class="text-xs text-text-secondary mb-3">{day.day}</div>
                  <div class="text-4xl mb-3">{day.icon}</div>
                  <div class="text-sm text-text-secondary mb-2">{day.condition}</div>
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-red-600 font-semibold">{day.high}°</span>
                    <span class="text-text-secondary">/</span>
                    <span class="text-blue-600 font-semibold">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View */}
            <div class="md:hidden divide-y divide-border">
              {forecast.value.map((day, index) => (
                <div key={index} class="p-4 flex items-center justify-between hover:bg-surface transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="text-3xl">{day.icon}</div>
                    <div>
                      <div class="font-medium text-text">{day.date}</div>
                      <div class="text-sm text-text-secondary">{day.day}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-text-secondary mb-1">{day.condition}</div>
                    <div class="flex items-center gap-2">
                      <span class="text-red-600 font-semibold">{day.high}°</span>
                      <span class="text-text-secondary">/</span>
                      <span class="text-blue-600 font-semibold">{day.low}°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Tips */}
        {!loading.value && currentWeather.value && (
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-text mb-4">生活建议</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex items-start gap-3 p-4 bg-surface rounded-lg">
                <div class="text-2xl">👕</div>
                <div>
                  <div class="font-medium text-text mb-1">穿衣指数</div>
                  <div class="text-sm text-text-secondary">
                    {currentWeather.value.temperature > 20
                      ? "适合穿短袖"
                      : currentWeather.value.temperature > 15
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
                    {currentWeather.value.aqi < 100 ? "适宜户外运动" : "建议室内运动"}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-surface rounded-lg">
                <div class="text-2xl">☂️</div>
                <div>
                  <div class="font-medium text-text mb-1">出行建议</div>
                  <div class="text-sm text-text-secondary">
                    {currentWeather.value.condition.includes("雨") ? "记得带伞" : "无需带伞"}
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
