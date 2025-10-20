"use client"

import { ref } from "vue"
import { RouterView, useRouter, useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth"

export default {
  name: "MainLayout",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const mobileMenuOpen = ref(false)

    const navItems = [
      { path: "/schedule", name: "课程表", icon: "📅" },
      { path: "/card", name: "一卡通", icon: "💳" },
      { path: "/weather", name: "天气", icon: "🌤️" },
      { path: "/map", name: "路线规划", icon: "🗺️" },
      { path: "/ai", name: "AI助手", icon: "🤖" },
    ]

    const handleLogout = () => {
      authStore.logout()
      router.push("/login")
    }

    return () => (
      <div class="min-h-screen flex flex-col">
        {/* Header */}
        <header class="bg-white border-b border-border sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold text-primary">同济校园助手</h1>
              </div>

              {/* Desktop Navigation */}
              <nav class="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    class={[
                      "px-4 py-2 rounded-lg font-medium transition-colors",
                      route.path === item.path ? "bg-primary text-white" : "text-text hover:bg-surface",
                    ]}
                  >
                    <span class="mr-2">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </nav>

              <div class="flex items-center gap-4">
                <div class="hidden md:block text-sm text-text-secondary">{authStore.studentInfo?.name || "学生"}</div>
                <button onClick={handleLogout} class="text-sm text-text-secondary hover:text-text transition-colors">
                  退出登录
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => (mobileMenuOpen.value = !mobileMenuOpen.value)}
                  class="md:hidden p-2 rounded-lg hover:bg-surface"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen.value && (
            <div class="md:hidden border-t border-border bg-white">
              <nav class="px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path)
                      mobileMenuOpen.value = false
                    }}
                    class={[
                      "w-full text-left px-4 py-3 rounded-lg font-medium transition-colors",
                      route.path === item.path ? "bg-primary text-white" : "text-text hover:bg-surface",
                    ]}
                  >
                    <span class="mr-2">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main class="flex-1">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <RouterView />
          </div>
        </main>

        {/* Footer */}
        <footer class="bg-white border-t border-border py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-text-secondary">
            <p>同济大学校园生活辅助系统 © 2025</p>
          </div>
        </footer>
      </div>
    )
  },
}
