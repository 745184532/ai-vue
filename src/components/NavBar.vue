<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{route.meta.title}}</p>
    </div>
    <div class="flex-box"> 
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="logoUrl" />
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { Expand } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin'
import { useRouter,useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/admin'

const router = useRouter()
const route = useRoute()

const logoUrl = new URL('@/assets/images/默认头像.png', import.meta.url).href
const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 处理退出登录逻辑
      logout().then(() => {
          //清楚缓存
          localStorage.removeItem('token')
          //清空用户信息
          localStorage.removeItem('userInfo')
          //跳转登录页
          router.push('/auth/login')        
      })
    })
  }
}
//修改侧边栏折叠状态
const handleCollapse = () => {
  useAdminStore().toggleCollapse()
}
</script>
<style lang="scss" scoped>
.navbar{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .flex-box{
  display: flex;
  justify-content: center;
  align-items: center;
  }
  .page-title{
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
  .user-name{
    margin: 0 5px;
    font-weight: bold;
  }
}
</style>
