<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
     <!-- :width="isCollapse要弄成动态宽度才能够收起来 -->
     <!--:collapse-transition="false" 关闭折叠过渡, 避免折叠时菜单项显示异常 -->
          <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"   
        default-active="2"
        class="menu-style"
      >
        <div class="brand">
            <el-image  style="width: 50px; height: 50px; margin-right: 10px;" :src="logoUrl" alt="logo" />
            <div v-show="!isCollapse" class="info-card"> <!-- 展开时显示 -->
                <h1 class="brand-title">心里健康AI助手</h1>
                <p class="brand-subtitle" >管理后台</p>
            </div>
        </div>
        <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon> <component :is = "item.meta.icon" /> </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
        
      </el-menu>
  </el-aside>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'
const router = useRouter()

const logoUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
//监听属性变化
const isCollapse = computed(() => useAdminStore().isCollapse)

const selectMenu = (key) =>{
    const currentRoute = router.options.routes[0]
    router.push(`${currentRoute.path}/${key.index}`)
}

</script>
<style lang="scss" scoped>
.menu-style{
    height: 100%;
        .brand{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px    ;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e4e7ed;
        .info-card{
            .brand-title{
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #303133;
            }
            .brand-subtitle{
                font-size: 14px;
                color: #909399;
            }
        }
    }
}

</style>
