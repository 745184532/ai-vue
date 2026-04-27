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
//流式对话
