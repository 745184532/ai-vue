import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
//路由的配置
const backendRouter = [    
    {
        path:'/back',
        component: BackendLayout,
        children:[
            {
            path: 'dashboard',
            component: ()=> import('@/views/dashboard.vue'),
            meta:{
                title:'数据分析',
                icon: 'PieChart'
            }
            },
            {
            path: 'knowledge',
            component: ()=> import('@/views/knowledge.vue'),
            meta:{
                title:'知识文章',
                icon: 'ChatLineSquare'
            }
            },
            {
            path: 'consultations',
            component: ()=> import('@/views/consultations.vue'),
            meta:{
                title:'咨询记录',
                icon: 'Message'
            }
            },
            {
            path: 'emotional',
            component: ()=> import('@/views/emotional.vue'),
            meta:{
                title:'情绪日志',
                icon: 'User'
            }
            }           
        ]
    }, //这里要注意，因为在Sidebar里面写死了路由，如果把下面登录页放到上面去，会在数据中显示登录页
    {
        path:'/auth',
        component: AuthLayout,
        children:[
            {
                path:'login',
                component:()=>import('@/views/login.vue'),
                meta:{
                    title:'登录'
                }
            },
            {
                path:'register',
                component:()=>import('@/views/register.vue'),
                meta:{
                    title:'注册'
                }
            }
        ]
    }
]
const router = createRouter({
    history:createWebHistory(),
    routes:backendRouter
})


export default router