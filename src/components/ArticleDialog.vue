<template>
    <el-dialog title="文章详情" 
    v-model="dialogVisible" 
    width="50%" 
    @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="50" show-word-limit clearable />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { ref,computed,reactive } from 'vue'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
//由于modelValue，是从父组件传入进来的，正常不能再子组件里面prop直接修改，要解决这个问题，采用在子组件里面再定义计算属性，然后对父组件的状态进行监听，
//当状态发生变化的时候，再去修改它
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue',val)
    }

})
const handleClose = ()=>{}
//表单数据
const formData = reactive({    
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 0,
    "summary": "",
    "tags": "",
    "id": ""
})
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 50, message: '文章标题最多50个字符', trigger: 'blur' },
    ],
})
</script>
<style scoped>
</style>