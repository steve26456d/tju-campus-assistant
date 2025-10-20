"use client"

import { ref, onMounted } from "vue"
import api from "../utils/api"

export default {
  name: "Schedule",
  setup() {
    const scheduleData = ref([])
    const loading = ref(true)
    const error = ref("")
    const currentWeek = ref(1)
    const selectedWeek = ref(1)

    const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    const timeSlots = [
      { period: "1-2节", time: "08:00-09:35" },
      { period: "3-4节", time: "09:55-11:30" },
      { period: "5-6节", time: "13:00-14:35" },
      { period: "7-8节", time: "14:55-16:30" },
      { period: "9-10节", time: "18:00-19:35" },
      { period: "11-12节", time: "19:55-21:30" },
    ]

    const fetchSchedule = async () => {
      loading.value = true
      error.value = ""

      try {
        const response = await api.get("/api/tongji/v1/rt/onetongji/student_timetable", {
          params: {
            week: selectedWeek.value,
          },
        })

        scheduleData.value = response.data.courses || []
      } catch (err) {
        console.error("Failed to fetch schedule:", err)
        error.value = "获取课表失败，请稍后重试"

        // 使用模拟数据用于演示
        scheduleData.value = [
          {
            courseName: "高等数学",
            teacher: "张教授",
            location: "同济楼A301",
            weekday: 1,
            startPeriod: 1,
            endPeriod: 2,
            weeks: "1-16周",
          },
          {
            courseName: "大学物理",
            teacher: "李教授",
            location: "实验楼B205",
            weekday: 2,
            startPeriod: 3,
            endPeriod: 4,
            weeks: "1-16周",
          },
          {
            courseName: "程序设计",
            teacher: "王老师",
            location: "计算机楼C401",
            weekday: 3,
            startPeriod: 5,
            endPeriod: 6,
            weeks: "1-16周",
          },
          {
            courseName: "英语",
            teacher: "陈老师",
            location: "外语楼D102",
            weekday: 4,
            startPeriod: 1,
            endPeriod: 2,
            weeks: "1-16周",
          },
          {
            courseName: "体育",
            teacher: "赵教练",
            location: "体育馆",
            weekday: 5,
            startPeriod: 7,
            endPeriod: 8,
            weeks: "1-16周",
          },
        ]
      } finally {
        loading.value = false
      }
    }

    const getCourseForSlot = (weekday, period) => {
      return scheduleData.value.find(
        (course) => course.weekday === weekday && period >= course.startPeriod && period <= course.endPeriod,
      )
    }

    const getCourseColor = (courseName) => {
      const colors = [
        "bg-blue-100 border-blue-300 text-blue-800",
        "bg-green-100 border-green-300 text-green-800",
        "bg-purple-100 border-purple-300 text-purple-800",
        "bg-orange-100 border-orange-300 text-orange-800",
        "bg-pink-100 border-pink-300 text-pink-800",
        "bg-teal-100 border-teal-300 text-teal-800",
      ]

      const hash = courseName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return colors[hash % colors.length]
    }

    const changeWeek = (delta) => {
      const newWeek = selectedWeek.value + delta
      if (newWeek >= 1 && newWeek <= 20) {
        selectedWeek.value = newWeek
        fetchSchedule()
      }
    }

    onMounted(() => {
      fetchSchedule()
    })

    return () => (
      <div class="space-y-6">
        {/* Header */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-text">课程表</h2>
              <p class="text-text-secondary mt-1">查看本学期课程安排</p>
            </div>

            {/* Week Selector */}
            <div class="flex items-center gap-3">
              <button
                onClick={() => changeWeek(-1)}
                disabled={selectedWeek.value <= 1}
                class="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div class="text-center min-w-[120px]">
                <div class="text-lg font-semibold text-text">第 {selectedWeek.value} 周</div>
                {selectedWeek.value === currentWeek.value && <div class="text-xs text-secondary">当前周</div>}
              </div>

              <button
                onClick={() => changeWeek(1)}
                disabled={selectedWeek.value >= 20}
                class="p-2 rounded-lg border border-border hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading.value && (
          <div class="bg-white rounded-xl shadow-sm p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p class="mt-4 text-text-secondary">加载课表中...</p>
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

        {/* Schedule Table - Desktop */}
        {!loading.value && (
          <div class="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-surface">
                    <th class="border border-border p-3 text-left font-semibold text-text w-32">时间</th>
                    {weekdays.map((day) => (
                      <th key={day} class="border border-border p-3 text-center font-semibold text-text">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, slotIndex) => (
                    <tr key={slotIndex}>
                      <td class="border border-border p-3 bg-surface">
                        <div class="text-sm font-medium text-text">{slot.period}</div>
                        <div class="text-xs text-text-secondary mt-1">{slot.time}</div>
                      </td>
                      {weekdays.map((day, dayIndex) => {
                        const course = getCourseForSlot(dayIndex + 1, slotIndex * 2 + 1)
                        const isFirstPeriod = course && course.startPeriod === slotIndex * 2 + 1

                        return (
                          <td key={dayIndex} class="border border-border p-2">
                            {course && isFirstPeriod ? (
                              <div class={`${getCourseColor(course.courseName)} rounded-lg p-3 border-2 h-full`}>
                                <div class="font-semibold text-sm leading-tight">{course.courseName}</div>
                                <div class="text-xs mt-2 space-y-1">
                                  <div>{course.teacher}</div>
                                  <div>{course.location}</div>
                                  <div class="text-xs opacity-75">{course.weeks}</div>
                                </div>
                              </div>
                            ) : null}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Schedule List - Mobile */}
        {!loading.value && (
          <div class="lg:hidden space-y-4">
            {weekdays.map((day, dayIndex) => {
              const dayCourses = scheduleData.value.filter((course) => course.weekday === dayIndex + 1)

              return (
                <div key={day} class="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div class="bg-primary text-white px-4 py-3 font-semibold">{day}</div>
                  <div class="p-4 space-y-3">
                    {dayCourses.length > 0 ? (
                      dayCourses.map((course, idx) => (
                        <div key={idx} class={`${getCourseColor(course.courseName)} rounded-lg p-4 border-2`}>
                          <div class="font-semibold text-base mb-2">{course.courseName}</div>
                          <div class="text-sm space-y-1">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">时间:</span>
                              <span>
                                第{course.startPeriod}-{course.endPeriod}节
                              </span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="font-medium">教师:</span>
                              <span>{course.teacher}</span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="font-medium">地点:</span>
                              <span>{course.location}</span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="font-medium">周次:</span>
                              <span>{course.weeks}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div class="text-center py-8 text-text-secondary">本日无课程</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Course Statistics */}
        {!loading.value && scheduleData.value.length > 0 && (
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-text mb-4">本周课程统计</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-surface rounded-lg">
                <div class="text-2xl font-bold text-primary">{scheduleData.value.length}</div>
                <div class="text-sm text-text-secondary mt-1">总课程数</div>
              </div>
              <div class="text-center p-4 bg-surface rounded-lg">
                <div class="text-2xl font-bold text-secondary">
                  {new Set(scheduleData.value.map((c) => c.courseName)).size}
                </div>
                <div class="text-sm text-text-secondary mt-1">不同课程</div>
              </div>
              <div class="text-center p-4 bg-surface rounded-lg">
                <div class="text-2xl font-bold text-accent">
                  {new Set(scheduleData.value.map((c) => c.teacher)).size}
                </div>
                <div class="text-sm text-text-secondary mt-1">授课教师</div>
              </div>
              <div class="text-center p-4 bg-surface rounded-lg">
                <div class="text-2xl font-bold text-green-600">
                  {scheduleData.value.reduce((sum, c) => sum + (c.endPeriod - c.startPeriod + 1), 0)}
                </div>
                <div class="text-sm text-text-secondary mt-1">总课时</div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
}
