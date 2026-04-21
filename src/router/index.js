import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
//路由的配置
const backendRouter = [    
    {
        path:'/back',
        redirect:'/back/dashboard', //默认跳转到数据分析
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

//路由前置守卫
router.beforeEach((to,from,next) => {
    const token = localStorage.getItem('token')
    //当前用户是否登录
    if(token){
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        //如果是后台用户，
        if(userInfo.userType == 2){
            if(to.path.startsWith('/back')){
                next()
            }else{
                next('/back/dashboard')
            }
        }else if(userInfo.userType == 1){

        }
        next()
    }else{
        if(to.path.startsWith('/back')){
            //如果是访问后台页面，那么跳转到登录页
            next('/auth/login')
        }else{
            next()
        }
    }
})

export default router