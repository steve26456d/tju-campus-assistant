import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "axios"
import api from "../utils/api"

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "")
  const studentInfo = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (studentId, password) => {
    try {
      // 这里应该调用同济统一身份认证API
      // 由于实际API需要OAuth流程，这里简化处理
      const response = await api.post("/api/tongji/auth/login", {
        studentId,
        password,
      })

      token.value = response.data.token
      localStorage.setItem("token", token.value)

      // 获取学生基本信息
      await fetchStudentInfo()

      return { success: true }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, error: error.message }
    }
  }

  const fetchStudentInfo = async () => {
    try {
      const response = await api.get("/api/tongji/v2/dc/user/student_infos")
      studentInfo.value = response.data
    } catch (error) {
      console.error("Failed to fetch student info:", error)
    }
  }

  const logout = () => {
    token.value = ""
    studentInfo.value = null
    localStorage.removeItem("token")
  }

  return {
    token,
    studentInfo,
    isAuthenticated,
    login,
    logout,
    fetchStudentInfo,
  }
})
