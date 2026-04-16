<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button @click="handleEdit({})" type="primary">添加</el-button>
      </template>
    </PageHead>
    <TableSearch :fromItem="fromItem" @search="handleSearch" />
    <el-table :data="tableData" style="width:100%; margin-top:25px">
      <el-table-column label="文章标题" width="400"  fixed="left">
        <template #default="scope">
          <div style="display:flex;align-items:center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display:flex;align-items:center">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者"  width="150" />
      <el-table-column prop="readCount" label="阅读量"  width="150" />
      <el-table-column prop="updatedAt" label="发布时间"  />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 ||scope.row.status ===2 " text type="success">发布</el-button>
          <el-button @click="handleUnPublish(scope.row)" v-if="scope.row.status === 1 " text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
    style="margin-top: 25px" 
    :page-size="pagination.size" 
    layout="prev, pager, next" 
    :total="pagination.total" 
    @change="handleChange" />
    <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categoryies="categoryies" @success="handleSuccess" />
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { categoryTree,articlePage,getArticleDetail,changeArticleStatus,deleteArticle } from '@/api/admin.js'
import { onMounted ,reactive,ref} from 'vue'
import{ElMessageBox,ElMessage} from 'element-plus'

const fromItem = [
  { comp: 'input',   prop: 'title',    label: '文章标题',    placeholder: '请输入文章标题'},
  { comp: 'select',  prop: 'categoryId',  label: '分类',    placeholder: '请选择分类'},
  { comp: 'select',  prop: 'status',  label: '状态',    placeholder: '请选择文章内容', options:[
    {label:'草稿',value:0},{label:'已发布',value:1},{label:'已下线',value:2},
  ]},

]
//分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
})

// 这个是为了回调的, 当用户点击搜索按钮时, 会调用这个函数
// 并将用户输入的搜索条件作为参数传递给这个函数
const handleSearch = async (formData) => {
    console.log(formData,'查询参数')
    
    const params = {
      ...pagination,
      ...formData,
    }
    const {records , total} = await articlePage(params)
    tableData.value = records
    // 【关键】必须更新 pagination 的 total，分页组件才会显示正确的页码
    pagination.total = total
          
}
// 分页回调函数
const handleChange = (page) => {
    pagination.currentPage = page
    // 触发查询
    handleSearch()
}
//分类映射
const categoryMap = reactive({})
//分类列表
const categoryies = ref([])
//列表数据
const tableData = ref([])
//新增和编辑
const dialogVisible = ref(false)
//编辑表单数据
const currentArticle = ref(null)

onMounted( async () => {
    const data = await categoryTree()
    
    categoryies.value = data.map(item => {
      categoryMap[item.id] = item.categoryName
      return{
        label: item.categoryName,
        value: item.id,
      }     
    })
    
     fromItem[1].options = categoryies.value
     // 【关键】初始化调用一次，让页面加载即有数据
    handleSearch()
})
// 新增或编辑成功后，刷新列表
const handleSuccess = () => {
  // 关闭弹窗
  dialogVisible.value = false
  // 刷新列表
  handleSearch()
}
// 编辑文章
const handleEdit = (row) => {
   if(!row.id) {
    //新增文章
    currentArticle.value = null
    dialogVisible.value = true
   }else {
    //编辑文章
    getArticleDetail(row.id).then(res => {
    currentArticle.value = res
    dialogVisible.value = true
   })
   }
   
}
// 发布文章，引用elbox2次确认
const handlePublish = (row) => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定发布',
    cancelButtonText: '取消',
    type: 'info',
  }).then(() => {
    // 发布文章逻辑
    changeArticleStatus(row.id,{status:1}).then(res => {
      ElMessage.success('发布成功')
      // 刷新列表
      handleSearch()
    })
  })
}
const handleUnPublish = (row) => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定下线',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 下线文章逻辑
    changeArticleStatus(row.id,{status:2}).then(res => {
      ElMessage.success('下线成功')
      // 刷新列表
      handleSearch()
    })
  })
}
//删除文章
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'danger',
  }).then(() => {
    // 删除文章逻辑
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功')
      // 刷新列表
      handleSearch()
    })
  })
}
//下线文章

</script>