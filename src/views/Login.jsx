"use client"

import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"

export default {
  name: "Login",
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const studentId = ref("")
    const password = ref("")
    const loading = ref(false)
    const error = ref("")

    const handleLogin = async () => {
      if (!studentId.value || !password.value) {
        error.value = "请输入学号和密码"
        return
      }

      loading.value = true
      error.value = ""

      const result = await authStore.login(studentId.value, password.value)

      loading.value = false

      if (result.success) {
        router.push("/")
      } else {
        error.value = "登录失败，请检查学号和密码"
      }
    }

    return () => (
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-primary mb-2">同济校园助手</h1>
              <p class="text-text-secondary">使用统一身份认证登录</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin()
              }}
              class="space-y-6"
            >
              <div>
                <label class="block text-sm font-medium text-text mb-2">学号</label>
                <input
                  type="text"
                  v-model={studentId.value}
                  onInput={(e) => (studentId.value = e.target.value)}
                  placeholder="请输入学号"
                  class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text mb-2">密码</label>
                <input
                  type="password"
                  v-model={password.value}
                  onInput={(e) => (password.value = e.target.value)}
                  placeholder="请输入密码"
                  class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {error.value && (
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error.value}
                </div>
              )}

              <button
                type="submit"
                disabled={loading.value}
                class="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading.value ? "登录中..." : "登录"}
              </button>
            </form>

            <div class="mt-6 text-center text-sm text-text-secondary">
              <p>使用同济大学统一身份认证</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
