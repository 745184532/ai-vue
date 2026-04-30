import service from '@/utils/request'

export const register = (data) =>{
    return service.post('/user/add', data)
}

//AI新对话
export const startSession = (data) =>{
    return service.post('/psychological-chat/session/start', data)
}

export const getSessionList = (params) =>{
    return service.get('/psychological-chat/sessions',{params})
}
//删除会话
export const deleteSession = (sessionId) =>{
    return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
//获取会话详情
export const getSessionDetail = (sessionId) =>{
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//获取情绪接口结果
export const getSessionEmotion = (sessionId) =>{
    return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
//情绪日志提交接口
export const addEmotionDiary = (data) =>{
    return service.post('/emotion-diary', data)
}
//查询知识文章列表
export const getKnowledgeList = (params) =>{
    return service.get('/knowledge/article/page',{params})
}
//获取知识文章详情
export const getKnowledgeDetail = (articleId) =>{
    return service.get(`/knowledge/article/${articleId}`)
}