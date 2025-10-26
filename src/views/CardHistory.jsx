"use client"

import { ref, onMounted, computed } from "vue"
import api from "../utils/api"

export default {
  name: "CardHistory",
  setup() {
    const transactions = ref([])
    const loading = ref(true)
    const error = ref("")
    const balance = ref(0)
    const filterType = ref("all") // all, income, expense
    const searchQuery = ref("")
    const dateRange = ref("week") // week, month, all

    const fetchCardHistory = async () => {
      loading.value = true
      error.value = ""

      try {
        const response = await api.get("/api/tongji/v1/dc/card/card_history_flow", {
          params: {
            range: dateRange.value,
          },
        })

        transactions.value = response.data.transactions || []
        balance.value = response.data.balance || 0
      } catch (err) {
        console.error("Failed to fetch card history:", err)
        error.value = "获取一卡通流水失败，请稍后重试"

        // 使用模拟数据用于演示
        balance.value = 328.56
        transactions.value = [
          {
            id: 1,
            type: "expense",
            amount: 12.5,
            location: "第一食堂",
            time: "2025-01-20 12:30:45",
            balance: 328.56,
            category: "餐饮",
          },
          {
            id: 2,
            type: "expense",
            amount: 8.0,
            location: "第二食堂",
            time: "2025-01-20 18:15:22",
            balance: 341.06,
            category: "餐饮",
          },
          {
            id: 3,
            type: "expense",
            amount: 2.5,
            location: "图书馆打印室",
            time: "2025-01-19 14:20:10",
            balance: 349.06,
            category: "打印",
          },
          {
            id: 4,
            type: "income",
            amount: 200.0,
            location: "在线充值",
            time: "2025-01-19 10:00:00",
            balance: 351.56,
            category: "充值",
          },
          {
            id: 5,
            type: "expense",
            amount: 15.0,
            location: "校园超市",
            time: "2025-01-18 16:45:30",
            balance: 151.56,
            category: "购物",
          },
          {
            id: 6,
            type: "expense",
            amount: 3.5,
            location: "开水房",
            time: "2025-01-18 08:30:15",
            balance: 166.56,
            category: "生活",
          },
          {
            id: 7,
            type: "expense",
            amount: 10.5,
            location: "第三食堂",
            time: "2025-01-17 12:00:00",
            balance: 170.06,
            category: "餐饮",
          },
          {
            id: 8,
            type: "expense",
            amount: 5.0,
            location: "洗衣房",
            time: "2025-01-17 20:30:00",
            balance: 180.56,
            category: "生活",
          },
        ]
      } finally {
        loading.value = false
      }
    }

    const filteredTransactions = computed(() => {
      let result = transactions.value

      // Filter by type
      if (filterType.value !== "all") {
        result = result.filter((t) => t.type === filterType.value)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (t) => t.location.toLowerCase().includes(query) || t.category.toLowerCase().includes(query),
        )
      }

      return result
    })

    const totalIncome = computed(() => {
      return transactions.value.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    })

    const totalExpense = computed(() => {
      return transactions.value.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    })

    const categoryStats = computed(() => {
      const stats = {}
      transactions.value
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          if (!stats[t.category]) {
            stats[t.category] = 0
          }
          stats[t.category] += t.amount
        })
      return Object.entries(stats)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
    })

    const getTransactionIcon = (category) => {
      const icons = {
        餐饮: "🍽️",
        充值: "💰",
        购物: "🛒",
        打印: "🖨️",
        生活: "🏠",
        交通: "🚌",
        其他: "📝",
      }
      return icons[category] || icons["其他"]
    }

    onMounted(() => {
      fetchCardHistory()
    })

    return () => (
      <div class="space-y-6">
        {/* Header with Balance */}
        <div class="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg p-6 text-text">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold">一卡通余额</h2>
              <div class="text-4xl font-bold mt-2">¥ {balance.value.toFixed(2)}</div>
            </div>
            <button
              onClick={fetchCardHistory}
              class="self-start sm:self-auto px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-red-400 transition-all"
            >
              刷新余额
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-text-secondary text-sm">本期收入</div>
                <div class="text-2xl font-bold text-green-600 mt-1">¥ {totalIncome.value.toFixed(2)}</div>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">📈</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-text-secondary text-sm">本期支出</div>
                <div class="text-2xl font-bold text-red-600 mt-1">¥ {totalExpense.value.toFixed(2)}</div>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">📉</div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-text-secondary text-sm">交易笔数</div>
                <div class="text-2xl font-bold text-primary mt-1">{transactions.value.length}</div>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📊</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div class="flex-1">
              <input
                type="text"
                placeholder="搜索地点或类别..."
                value={searchQuery.value}
                onInput={(e) => (searchQuery.value = e.target.value)}
                class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Type Filter */}
            <div class="flex gap-2">
              <button
                onClick={() => (filterType.value = "all")}
                class={[
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  filterType.value === "all" ? "bg-primary text-white" : "bg-surface text-text hover:bg-gray-200",
                ]}
              >
                全部
              </button>
              <button
                onClick={() => (filterType.value = "income")}
                class={[
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  filterType.value === "income" ? "bg-green-600 text-white" : "bg-surface text-text hover:bg-gray-200",
                ]}
              >
                收入
              </button>
              <button
                onClick={() => (filterType.value = "expense")}
                class={[
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  filterType.value === "expense" ? "bg-red-600 text-white" : "bg-surface text-text hover:bg-gray-200",
                ]}
              >
                支出
              </button>
            </div>

            {/* Date Range */}
            <select
              value={dateRange.value}
              onChange={(e) => {
                dateRange.value = e.target.value
                fetchCardHistory()
              }}
              class="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="all">全部记录</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading.value && (
          <div class="bg-white rounded-xl shadow-sm p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p class="mt-4 text-text-secondary">加载流水记录中...</p>
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

        {/* Transaction List */}
        {!loading.value && (
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-border">
              <h3 class="text-lg font-semibold text-text">交易记录</h3>
            </div>

            {filteredTransactions.value.length > 0 ? (
              <div class="divide-y divide-border">
                {filteredTransactions.value.map((transaction) => (
                  <div key={transaction.id} class="p-6 hover:bg-surface transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4 flex-1">
                        <div class="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-2xl">
                          {getTransactionIcon(transaction.category)}
                        </div>
                        <div class="flex-1">
                          <div class="font-semibold text-text">{transaction.location}</div>
                          <div class="text-sm text-text-secondary mt-1">{transaction.time}</div>
                          <div class="text-xs text-text-secondary mt-1">余额: ¥{transaction.balance.toFixed(2)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div
                          class={[
                            "text-xl font-bold",
                            transaction.type === "income" ? "text-green-600" : "text-red-600",
                          ]}
                        >
                          {transaction.type === "income" ? "+" : "-"}¥{transaction.amount.toFixed(2)}
                        </div>
                        <div class="text-xs text-text-secondary mt-1 px-2 py-1 bg-surface rounded">
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="p-12 text-center text-text-secondary">
                <div class="text-4xl mb-4">📭</div>
                <p>暂无交易记录</p>
              </div>
            )}
          </div>
        )}

        {/* Category Statistics */}
        {!loading.value && categoryStats.value.length > 0 && (
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-text mb-4">消费分类统计</h3>
            <div class="space-y-3">
              {categoryStats.value.map((stat) => {
                const percentage = (stat.amount / totalExpense.value) * 100
                return (
                  <div key={stat.category}>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span>{getTransactionIcon(stat.category)}</span>
                        <span class="font-medium text-text">{stat.category}</span>
                      </div>
                      <span class="font-semibold text-text">¥{stat.amount.toFixed(2)}</span>
                    </div>
                    <div class="w-full bg-surface rounded-full h-2 overflow-hidden">
                      <div
                        class="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div class="text-xs text-text-secondary mt-1 text-right">{percentage.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
}
