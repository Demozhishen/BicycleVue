import { createRouter, createWebHistory } from 'vue-router'

import Login from "@/views/Login";
import Layout from "@/layout/Layout";
import Vehicle from "@/views/vehicle";


const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect:"/vehicle",
    children:[
      {
        path: '/vehicle',
        name: 'vehicle',
        component: Vehicle,

      },
      {
        path: '/fence',
        name: 'fence',
        component: ()=>import("@/views/fence"),
      },
      {
        path: '/repairManagement',
        name: 'repairManagement',
        component: ()=>import("@/views/RepairManagement")
      },
      {
        path: '/vehicleUsage',
        name: 'vehicleUsage',
        component: ()=>import("@/views/vehicleUsage")
      },
      {
        path: '/home',
        name: 'home',
        component: ()=>import("@/views/home")
      },
      {
        path: '/admin',
        name: 'admin',
        component: ()=>import("@/views/admin")
      },
      {
        path: '/map',
        name: 'map',
        component: ()=>import("@/views/map")
      },
      {
        path: '/vehiclePredict',
        name: 'vehiclePredict',
        component: ()=>import("@/views/vehiclePredict")
      },


    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: ()=>import("@/views/404")
  },

]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
/*// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menu");
  if (storeMenus) {
    // 拼装动态路由
    const manageRoute = { path: '/', name: 'layout', component:Layout, redirect: "/home", children: [
        {
          path: '/home',
          name: 'home',
          component: ()=>import('@/views/home.vue')
        },
      ] }
    const menus = JSON.parse(storeMenus)
    menus.forEach(item => {
      if (item.path) {  // 当且仅当path不为空的时候才去设置路由
        let itemMenu = { path: item.path, name: item.name, component: () => import('../views/' + item.path.replace("/", "") + '.vue')}
        manageRoute.children.push(itemMenu)
      } else if(item.children.length) {
        item.children.forEach(item => {
          if (item.path) {
            let itemMenu = { path: item.path, name: item.name, component: () => import('../views/' + item.path.replace("/", "") + '.vue')}
            manageRoute.children.push(itemMenu)
          }
        })
      }
    })

    // 获取当前的路由对象名称数组
      router.addRoute(manageRoute)

  }
}

setRoutes();*/



export default router
