import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueCookies from "vue-cookies"
import axios from "axios"

const app = createApp(App)
app.use(router)
app.use(VueCookies)
VueCookies.config("30d")
app.mount("#app")
app.config.globalProperties.$axios = axios
app.config.globalProperties.$BASE_API = "https://api.nerina.pw"