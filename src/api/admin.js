import service from '@/utils/request'

export function login(data){
    return service.post('/user/login', data)
}

export function categoryTree(){
    return service.get('/knowledge/category/tree')
}

export function articlePage(params){
    return service.get('/knowledge/article/page',{params})
}

export function uploadFile(File,businessInfo){
    const formData = new FormData()
    formData.append('file', File)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField','cover')
    return service.post('/file/upload',formData ,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function createArticle(data){
    return service.post('/knowledge/article', data)
}

export function getArticleDetail(id){
    return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(id, data){
    return service.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id, data){
    return service.put(`/knowledge/article/${id}/status`,data)
}

export function deleteArticle(id){
    return service.delete(`/knowledge/article/${id}`)
}

//咨询记录
export function getConsultationPage(params){
    return service.get('/psychological-chat/sessions',{params})
}

export function getConsultationDetail(sessionId){
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//情绪评分接口
export function getEmotionalScore(params){
    return service.get('/emotion-diary/admin/page',{params})
}
//删除情绪日志
export function deleteEmotional(id){
    return service.delete(`/emotion-diary/admin/${id}`)
}