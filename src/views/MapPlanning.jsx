"use client"

import { ref, onMounted, onUnmounted } from "vue"
import api from "../utils/api"

export default {
  name: "MapPlanning",
  setup() {
    const map = ref(null)
    const mapContainer = ref(null)
    const startPoint = ref("")
    const endPoint = ref("")
    const travelMode = ref("walking") // walking, transit, driving
    const routeInfo = ref(null)
    const loading = ref(false)
    const todayCourses = ref([])
    const selectedCourse = ref(null)

    // 同济大学常用地点
    const campusLocations = [
      { name: "四平路校区南门", lat: 31.2816, lng: 121.5046 },
      { name: "同济楼", lat: 31.2825, lng: 121.5055 },
      { name: "图书馆", lat: 31.2835, lng: 121.5065 },
      { name: "第一食堂", lat: 31.282, lng: 121.505 },
      { name: "第二食堂", lat: 31.283, lng: 121.506 },
      { name: "体育馆", lat: 31.284, lng: 121.507 },
      { name: "实验楼", lat: 31.2828, lng: 121.5058 },
      { name: "计算机楼", lat: 31.2832, lng: 121.5062 },
      { name: "外语楼", lat: 31.2822, lng: 121.5052 },
      { name: "学生宿舍区", lat: 31.2815, lng: 121.5048 },
    ]

    const initMap = () => {
      if (!window.BMapGL) {
        console.error("Baidu Map API not loaded")
        return
      }

      // 初始化地图
      map.value = new window.BMapGL.Map(mapContainer.value)
      const point = new window.BMapGL.Point(121.5055, 31.2825) // 同济大学
      map.value.centerAndZoom(point, 16)
      map.value.enableScrollWheelZoom(true)

      // 添加校园地点标记
      campusLocations.forEach((location) => {
        const marker = new window.BMapGL.Marker(new window.BMapGL.Point(location.lng, location.lat))
        map.value.addOverlay(marker)

        const label = new window.BMapGL.Label(location.name, {
          position: new window.BMapGL.Point(location.lng, location.lat),
          offset: new window.BMapGL.Size(10, -20),
        })
        label.setStyle({
          color: "#1e40af",
          fontSize: "12px",
          backgroundColor: "white",
          border: "1px solid #1e40af",
          padding: "2px 6px",
          borderRadius: "4px",
        })
        map.value.addOverlay(label)
      })
    }

    const fetchTodayCourses = async () => {
      try {
        const response = await api.get("/api/tongji/v1/rt/onetongji/student_timetable", {
          params: {
            date: new Date().toISOString().split("T")[0],
          },
        })

        todayCourses.value = response.data.courses || []
      } catch (err) {
        console.error("Failed to fetch today's courses:", err)

        // 模拟数据
        todayCourses.value = [
          {
            courseName: "高等数学",
            location: "同济楼A301",
            startTime: "08:00",
            endTime: "09:35",
          },
          {
            courseName: "程序设计",
            location: "计算机楼C401",
            startTime: "13:00",
            endTime: "14:35",
          },
        ]
      }
    }

    const planRoute = () => {
      if (!startPoint.value || !endPoint.value) {
        alert("请输入起点和终点")
        return
      }

      if (!window.BMapGL) {
        alert("地图API未加载，请刷新页面重试")
        return
      }

      loading.value = true

      // 清除之前的路线
      map.value.clearOverlays()

      // 重新添加地点标记
      campusLocations.forEach((location) => {
        const marker = new window.BMapGL.Marker(new window.BMapGL.Point(location.lng, location.lat))
        map.value.addOverlay(marker)
      })

      // 创建路线规划实例
      let transit
      if (travelMode.value === "walking") {
        transit = new window.BMapGL.WalkingRoute(map.value, {
          onSearchComplete: (results) => {
            if (transit.getStatus() === window.BMAP_STATUS_SUCCESS) {
              const plan = results.getPlan(0)
              routeInfo.value = {
                distance: plan.getDistance(true),
                duration: plan.getDuration(true),
                steps: plan.getNumRoutes(),
              }

              // 绘制路线
              const pts = plan.getPath()
              const polyline = new window.BMapGL.Polyline(pts, {
                strokeColor: "#1e40af",
                strokeWeight: 6,
                strokeOpacity: 0.8,
              })
              map.value.addOverlay(polyline)
              map.value.setViewport(pts)
            }
            loading.value = false
          },
        })
      } else if (travelMode.value === "transit") {
        transit = new window.BMapGL.TransitRoute(map.value, {
          onSearchComplete: (results) => {
            if (transit.getStatus() === window.BMAP_STATUS_SUCCESS) {
              const plan = results.getPlan(0)
              routeInfo.value = {
                distance: plan.getDistance(true),
                duration: plan.getDuration(true),
                steps: plan.getNumRoutes(),
              }
            }
            loading.value = false
          },
        })
      } else {
        transit = new window.BMapGL.DrivingRoute(map.value, {
          onSearchComplete: (results) => {
            if (transit.getStatus() === window.BMAP_STATUS_SUCCESS) {
              const plan = results.getPlan(0)
              routeInfo.value = {
                distance: plan.getDistance(true),
                duration: plan.getDuration(true),
                steps: plan.getNumRoutes(),
              }

              const pts = plan.getPath()
              const polyline = new window.BMapGL.Polyline(pts, {
                strokeColor: "#0ea5e9",
                strokeWeight: 6,
                strokeOpacity: 0.8,
              })
              map.value.addOverlay(polyline)
              map.value.setViewport(pts)
            }
            loading.value = false
          },
        })
      }

      transit.search(startPoint.value, endPoint.value)
    }

    const selectCourse = (course) => {
      selectedCourse.value = course
      endPoint.value = course.location
      startPoint.value = "学生宿舍区"
    }

    onMounted(() => {
      fetchTodayCourses()

      // 等待百度地图API加载
      if (window.BMapGL) {
        initMap()
      } else {
        const checkMap = setInterval(() => {
          if (window.BMapGL) {
            initMap()
            clearInterval(checkMap)
          }
        }, 100)
      }
    })

    onUnmounted(() => {
      if (map.value) {
        map.value = null
      }
    })

    return () => (
      <div class="space-y-6">
        {/* Header */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-2xl font-bold text-text">路线规划</h2>
          <p class="text-text-secondary mt-1">校园导航与出行规划</p>
        </div>

        {/* Today's Courses */}
        {todayCourses.value.length > 0 && (
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-text mb-4">今日课程快速导航</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayCourses.value.map((course, index) => (
                <button
                  key={index}
                  onClick={() => selectCourse(course)}
                  class={[
                    "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                    selectedCourse.value === course
                      ? "border-primary bg-blue-50"
                      : "border-border hover:border-primary",
                  ]}
                >
                  <div class="font-semibold text-text mb-2">{course.courseName}</div>
                  <div class="text-sm text-text-secondary space-y-1">
                    <div>地点: {course.location}</div>
                    <div>
                      时间: {course.startTime} - {course.endTime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Route Planning Form */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-text mb-4">路线查询</h3>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text mb-2">起点</label>
                <input
                  type="text"
                  value={startPoint.value}
                  onInput={(e) => (startPoint.value = e.target.value)}
                  placeholder="输入起点或选择"
                  list="start-locations"
                  class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <datalist id="start-locations">
                  {campusLocations.map((loc) => (
                    <option key={loc.name} value={loc.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label class="block text-sm font-medium text-text mb-2">终点</label>
                <input
                  type="text"
                  value={endPoint.value}
                  onInput={(e) => (endPoint.value = e.target.value)}
                  placeholder="输入终点或选择"
                  list="end-locations"
                  class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <datalist id="end-locations">
                  {campusLocations.map((loc) => (
                    <option key={loc.name} value={loc.name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-text mb-2">出行方式</label>
              <div class="flex gap-2">
                <button
                  onClick={() => (travelMode.value = "walking")}
                  class={[
                    "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                    travelMode.value === "walking" ? "bg-primary text-white" : "bg-surface text-text hover:bg-gray-200",
                  ]}
                >
                  步行
                </button>
                <button
                  onClick={() => (travelMode.value = "transit")}
                  class={[
                    "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                    travelMode.value === "transit" ? "bg-primary text-white" : "bg-surface text-text hover:bg-gray-200",
                  ]}
                >
                  公交
                </button>
                <button
                  onClick={() => (travelMode.value = "driving")}
                  class={[
                    "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                    travelMode.value === "driving" ? "bg-primary text-white" : "bg-surface text-text hover:bg-gray-200",
                  ]}
                >
                  驾车
                </button>
              </div>
            </div>

            <button
              onClick={planRoute}
              disabled={loading.value}
              class="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.value ? "规划中..." : "开始规划"}
            </button>
          </div>

          {/* Route Info */}
          {routeInfo.value && (
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-sm text-text-secondary mb-1">距离</div>
                  <div class="text-lg font-bold text-text">{routeInfo.value.distance}</div>
                </div>
                <div>
                  <div class="text-sm text-text-secondary mb-1">时间</div>
                  <div class="text-lg font-bold text-text">{routeInfo.value.duration}</div>
                </div>
                <div>
                  <div class="text-sm text-text-secondary mb-1">路线数</div>
                  <div class="text-lg font-bold text-text">{routeInfo.value.steps}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div ref={mapContainer} style={{ width: "100%", height: "500px" }} class="bg-surface"></div>
        </div>

        {/* Campus Locations */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-text mb-4">校园常用地点</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {campusLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => {
                  if (!startPoint.value) {
                    startPoint.value = location.name
                  } else {
                    endPoint.value = location.name
                  }
                }}
                class="p-3 bg-surface hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors text-center"
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        {/* API Info */}
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div class="flex items-start gap-3">
            <div class="text-2xl">ℹ️</div>
            <div>
              <div class="font-medium text-blue-900 mb-1">地图服务说明</div>
              <div class="text-sm text-blue-700">
                本页面使用百度地图JS API
                GL提供路线规划服务。实际部署时需要在index.html中配置有效的百度地图AK密钥。课程地点可以与课表信息自动关联，方便快速导航。
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
