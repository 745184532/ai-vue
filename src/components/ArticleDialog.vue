<template>
    <el-dialog title="文章详情" 
    v-model="dialogVisible" 
    width="50%" 
    @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择分类">
                    <el-option v-for="item in props.categoryies" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="summary">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章内容(可选)" maxlength="1000" show-word-limit :rows="4"  />
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-select v-model="formData.tagArray" placeholder="请选择标签(逗号分隔)" multiple filterable allow-create style="width: 100%;" >
                    <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-upload">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :before-upload="beforeUpload"
                        :http-request="handleUploadRequest"
                        :show-file-list="false"
                        accept="image/*"  
                        >
                        <div v-if="!imgUrl" class="caover-preview">
                            <p>点击上传封面</p>                            
                        </div>
                        <img v-else :src="imgUrl" alt="封面图片" class="cover-image">                        
                    </el-upload>
                    <div v-if="imgUrl" class="cover-remove">
                        <el-button type="danger" size="small" @click="handleRemove">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <RichTextEditor v-model="formData.content" 
                placeholder="请输入文章内容"
                :maxlength="5000"
                @change="handleContentChange"
                @created="handleEditorCreated"
                min-height="400px"
                />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview">
            <h2>内容预览</h2>
            <div v-html="formData.content"></div>
        </div>
        <template #footer>
            <el-button v-if="!btnPreview" type="primary" @click="handleSubmit" >{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
            <el-button type="primary" @click="handleClose">取消</el-button>
            <el-button type="danger" @click="handleSubmit" :loading="loading">创建文章</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref,computed,reactive,nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile ,createArticle } from '@/api/admin.js'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const emit = defineEmits(['update:modelValue','success'])

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categoryies: {
        type: Array,
        default: () => []
    }
})
//由于modelValue，是从父组件传入进来的，正常不能再子组件里面prop直接修改，要解决这个问题，采用在子组件里面再定义计算属性，然后对父组件的状态进行监听，
//当状态发生变化的时候，再去修改它


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
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' },
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'change' },
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max: 5000, message: '文章内容必须5000个字符之间', trigger: 'blur' },
    ],
})
const commonTags =[
    '情绪管理','焦虑','抑郁','压力','睡眠',
    '冥想','正念','放松','心理健康','自我成长',
    '人际关系','工作压力','学习方法','生活技巧'
]
//封面图片
const imgUrl = ref('')
const beforeUpload = (file) => {
    //针对上传的文件进行校验
    const isImage = file.type.startsWith('image/')
    const isLt5M =file.size/1024/1024 <= 5
    if (!isImage) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('上传图片大小不能超过5MB!')
        return false
    }
    return true
}
const handleUploadRequest = async ({ file }) => {
    //UUID生成
    const businessId = crypto.randomUUID()
    const fileRes = await uploadFile(file,{
        businessId: businessId
    })
    console.log(fileRes,'上传文件')
    //拼接完整图片地址
    imgUrl.value = fileBaseUrl + fileRes.filePath
    formData.coverImage = fileRes.filePath
}
const handleRemove = () =>{
    imgUrl.value = ''
    formData.coverImage = ''
}
//富文本
const handleContentChange =(data) =>{
    formData.content = data.html
}
const editorInstance = ref(null)
const handleEditorCreated = (editor) =>{
    editorInstance.value = editor
    //编辑得情况
    if (formData.content && editor){
        nextTick(() => {
            editor.setHtml(formData.content) //富文本是异步得，要等它初始化完成，才能设置内容
        })
    }
}
//预览效果
const btnPreview = ref(false)
//提交
const loading = ref(false)
const formRef = ref()
const handleSubmit = () =>{
     formRef.value.validate((valid,fields) =>{
        if (valid) {
            loading.value = true
        }
        const submitData ={
            //对象属性合并
            ...formData,
            tags: formData.tagArray.join(','),
        }
        delete submitData.tagArray
        createArticle(submitData).then(res =>{
            loading.value = false
            emit('success')
        })
     })
}
</script>
<style scoped lang="scss">
.caover-preview {
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8b949e;
    background: #f6f8fa;
}
.cover-image{
    width: 200px;
    height:120px;
    display: block;
}
</style>