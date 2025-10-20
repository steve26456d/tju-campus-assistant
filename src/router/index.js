import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.jsx"),
  },
  {
    path: "/",
    name: "Layout",
    component: () => import("../layouts/MainLayout.jsx"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/schedule",
      },
      {
        path: "schedule",
        name: "Schedule",
        component: () => import("../views/Schedule.jsx"),
      },
      {
        path: "card",
        name: "Card",
        component: () => import("../views/CardHistory.jsx"),
      },
      {
        path: "weather",
        name: "Weather",
        component: () => import("../views/Weather.jsx"),
      },
      {
        path: "map",
        name: "Map",
        component: () => import("../views/MapPlanning.jsx"),
      },
      {
        path: "ai",
        name: "AI",
        component: () => import("../views/AIChat.jsx"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()

//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next("/login")
//   } else if (to.path === "/login" && authStore.isAuthenticated) {
//     next("/")
//   } else {
//     next()
//   }
// })

export default router
