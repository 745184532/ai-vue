<script setup >
import { Back } from '@element-plus/icons-vue';
import { ref,reactive } from 'vue';
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'

const router = useRouter()
const ruleFormRef = ref()
const formData = reactive({
    username: '',
    password: ''
})
// 表单验证规则
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
})
// 登录表单提交
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(formData)
            // 登录逻辑
            login(formData).then(data => {
                //判断token是否存在
                if(!data.token){
                    return console.error('登录失败')
                }
                //登录成功，保存token和用户信息
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo)) //在缓存里面只能使用字符串缓存
                //根据用户角色跳转不同的页面
                console.log(data.userInfo.userType)
                if(data.userInfo.userType === 2){
                    router.push('/back/dashboard')
                }else{
                }
            })
        }
    })
}


</script>

<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon> <Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录您的账号</h2>
                <p>请输入您的用户名和密码</p>
            </div>
        </div>
        <div class="form-container"> 
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
                <el-form-item label="用户名或者邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名或者邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large"  placeholder="请输入密码" type="password" show-password />
                </el-form-item>
                <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
            </el-form>    
            <div class="footer">
                <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.container {
    width: 384px;
    .title {
        .back-home{
            margin-bottom: 60px;
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 36px;
                margin-bottom: 10px;
            }
            p{
                font-size: 18px;
                color: #6b7280;
            }
        }               
    }
    .form-container{
        margin-top: 30px;
        .btn{
            margin-top: 40px;
            width: 100%;
        }
        .footer{
            margin-top: 30px;
            text-align: center;
        }
    } 
}
</style>