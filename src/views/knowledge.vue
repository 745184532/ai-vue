<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary">添加</el-button>
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
      <el-table-column prop="publishedAt" label="发布时间"  />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="parimary">编辑</el-button>
          <el-button v-if="scope.row.status === 0 ||scope.row.status ===2 " text type="success">发布</el-button>
          <el-button v-if="scope.row.status === 1 " text type="warning">下线</el-button>
          <el-button text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top: 25px" :page-size="pagination.size" layout="prev, pager, next" :total="pagination.total" @change="handleChange" />
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree,articlePage } from '@/api/admin.js'
import { onMounted ,reactive,ref} from 'vue'

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
</script>