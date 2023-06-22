import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import BaiduMap from 'vue-baidu-map'


createApp(App).use(store).use(router).use(ElementPlusIconsVue).use(ElementPlus, {
    locale: zhCn,
}).mount('#app')

router.beforeEach((to, from, next) => {
        if (to.meta.requireAuth) {
            if (store.state.user.username) {
                next()
            } else {
                next({
                    path: 'login',
                    query: {redirect: to.fullPath}
                })
            }
        } else {
            next()
        }
    }
)


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

