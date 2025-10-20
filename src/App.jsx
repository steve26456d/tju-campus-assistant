import { RouterView } from "vue-router"

export default {
  name: "App",
  setup() {
    return () => (
      <div id="app" class="min-h-screen bg-surface">
        <RouterView />
      </div>
    )
  },
}
