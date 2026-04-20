<template>
    <el-form ref="ruleFormRest" :model="formatDate">
        <el-row :gutter="24"> <!-- 栅格 -->
            <template v-for="item in formItemAttrs" :key="item.prop">  <!-- 表单域 -->
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <!-- v-if 并不好判断，单选框多选框，要动态的根据名字来实现，component 组件,传入select就显示下拉-->
                        <component v-model="formatDate[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder" >
                            <template v-if="item.comp === 'select'">
                                <el-option label="全部" value="" />
                                <el-option  v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </template>    
                        </component>                   
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset(ruleFormRest)">重置</el-button>
        </el-row>        
    </el-form>
</template> 
<script setup>
import { ref , reactive,computed} from 'vue'
const props = defineProps({
    fromItem: {
        type: Array,
        default: () => ({})
        // default: () => [({})]
    }
})
//这里要计算属性，是为了让栅格里面的字段能够自适应宽度
const formItemAttrs = computed(() => {
    const {fromItem} = props
    fromItem.forEach(item => {
        item.col = {xs: 24,sm: 12,md: 8,lg: 6,xl: 6}
    })
    return fromItem
})
const emit =defineEmits(['search'])
//初始化表单数据
//默认值为空字符串
const ruleFormRest = ref()
const formatDate = reactive({})
const isComp = (comp) => {
   return{ input : 'elInput', select : 'elSelect'}[comp]
}

//查询
const handleSearch=()=>{
    console.log(formatDate)
    emit('search',formatDate)
}
//重置
const handleReset=(fromEl)=>{
    //先重置再查询
    if(!fromEl){return}
    fromEl.resetFields()
    //重置查询条件
    emit('search',formatDate)
}
</script>
<style lang="scss" scoped>

</style>
