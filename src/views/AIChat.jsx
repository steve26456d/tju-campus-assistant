"use client"

import { ref, nextTick, computed } from "vue"
import axios from "axios"
import OpenAI from "openai"


export default {
  name: "AIChat",
  setup() {
    const messages = ref([
      {
        id: 1,
        role: "assistant",
        content:
          "你好！我是同济AI学习助手，基于Deepseek-R1模型。我可以帮助你解答学习问题、提供学习建议。有什么我可以帮助你的吗？",
        timestamp: new Date().toISOString(),
      },
    ])
    const inputMessage = ref("")
    const loading = ref(false)
    const chatContainer = ref(null)
    const error = ref("")

    const quickQuestions = ["如何高效学习高等数学？", "编程学习有什么建议？", "如何准备期末考试？", "推荐一些学习资源"]

    const openai = new OpenAI(
        {
            // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
            apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
            dangerouslyAllowBrowser: true,
            
        }
    );

    const scrollToBottom = async () => {
      await nextTick()
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }

    const sendMessage = async (content = null) => {
      const messageContent = content || inputMessage.value.trim()

      if (!messageContent) return

      // 添加用户消息
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: messageContent,
        timestamp: new Date().toISOString(),
      }
      messages.value.push(userMessage)
      inputMessage.value = ""
      loading.value = true
      error.value = ""

      await scrollToBottom()

      try {
        // 调用同济Agent平台的Deepseek-R1 API

        const completion = await openai.chat.completions.create({
            model: "qwen3-max",
            messages: messages.value.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
        });
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        }
        messages.value.push(assistantMessage)
        for await (const chunk of completion) {
            assistantMessage.content += chunk.choices[0].delta.content
        }

      } catch (err) {
        console.error("Failed to send message:", err)
        error.value = "发送消息失败，请稍后重试"

        // 使用模拟响应
        const mockResponse = {
          id: Date.now() + 1,
          role: "assistant",
          content: `关于"${messageContent}"的问题，这是一个很好的学习话题。\n\n作为AI学习助手，我建议：\n\n1. 制定明确的学习计划，分解大目标为小任务\n2. 保持规律的学习节奏，避免临时抱佛脚\n3. 多做练习和实践，理论结合实际\n4. 及时复习巩固，使用间隔重复记忆法\n5. 遇到困难及时寻求帮助，可以问老师或同学\n\n如果你有更具体的问题，欢迎继续提问！`,
          timestamp: new Date().toISOString(),
        }
        messages.value.push(mockResponse)
      } finally {
        loading.value = false
        await scrollToBottom()
      }
    }

    const clearChat = () => {
      if (confirm("确定要清空聊天记录吗？")) {
        messages.value = [
          {
            id: 1,
            role: "assistant",
            content: "聊天记录已清空。有什么新的问题我可以帮助你吗？",
            timestamp: new Date().toISOString(),
          },
        ]
      }
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    }

    const messageCount = computed(() => messages.value.length)

    return () => (
        <div class="flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div class="bg-white rounded-t-xl shadow-sm p-6 border-b border-border">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-text">AI学习助手</h2>
              <p class="text-text-secondary mt-1">基于Deepseek-R1模型 · {messageCount.value}条消息</p>
            </div>
            <button
              onClick={clearChat}
              class="px-4 py-2 text-sm text-text-secondary hover:text-text hover:bg-surface rounded-lg transition-colors"
            >
              清空记录
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.value.length <= 1 && (
          <div class="bg-white px-6 py-4 border-b border-border">
            <div class="text-sm font-medium text-text mb-3">快速提问</div>
            <div class="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  class="px-4 py-2 bg-surface hover:bg-primary hover:text-white rounded-lg text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div ref={chatContainer} class="flex-1 bg-surface overflow-y-auto p-6 space-y-4">
          {messages.value.map((message) => (
            <div key={message.id} class={["flex", message.role === "user" ? "justify-end" : "justify-start"]}>
              <div class={["flex gap-3 max-w-[80%]", message.role === "user" ? "flex-row-reverse" : "flex-row"]}>
                {/* Avatar */}
                <div
                  class={[
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl",
                    message.role === "user" ? "bg-primary text-white" : "bg-white border-2 border-primary",
                  ]}
                >
                  {message.role === "user" ? "👤" : "🤖"}
                </div>

                {/* Message Content */}
                <div class="flex flex-col gap-1">
                  <div
                    class={[
                      "rounded-2xl px-4 py-3 shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-text rounded-tr-none"
                        : "bg-white text-text rounded-tl-none",
                    ]}
                  >
                    <div class="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  </div>
                  <div
                    class={["text-xs text-text-secondary px-2", message.role === "user" ? "text-right" : "text-left"]}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading.value && (
            <div class="flex justify-start">
              <div class="flex gap-3 max-w-[80%]">
                <div class="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center flex-shrink-0 text-xl">
                  🤖
                </div>
                <div class="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div class="flex gap-2">
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div
                      class="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      class="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error.value && (
            <div class="flex justify-center">
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error.value} - 已切换到模拟模式
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div class="bg-white rounded-b-xl shadow-sm p-6 border-t border-border">
          <div class="flex gap-3">
            <textarea
              value={inputMessage.value}
              onInput={(e) => (inputMessage.value = e.target.value)}
              onKeypress={handleKeyPress}
              placeholder="输入你的问题... (Enter发送，Shift+Enter换行)"
              rows="1"
              class="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading.value || !inputMessage.value.trim()}
              class="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              发送
            </button>
          </div>

          <div class="mt-3 text-xs text-text-secondary">
            提示：AI助手可以帮助你解答学习问题，但请注意验证重要信息的准确性。
          </div>
        </div>

        {/* API Info */}
        <div class="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <div class="text-xl">ℹ️</div>
            <div>
              <div class="font-medium text-blue-900 text-sm mb-1">AI服务说明</div>
              <div class="text-xs text-blue-700">
                本页面使用同济Agent平台提供的Deepseek-R1本地模型。实际部署时需要配置正确的API认证token。当前显示模拟响应用于演示。
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
