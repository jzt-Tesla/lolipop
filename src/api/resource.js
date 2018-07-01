import axios from '@/libs/api.request'

// 资源管理树数据
export const reqResourceOperateTree = () => {
  return axios.request({
    url: '/sys/resource/operateTree',
    method: 'get'
  })
}

// 资源管理分页查询
export const reqResourceListPage = (method, params, data) => {
  return axios.request({
    url: '/sys/resource/listPage',
    method: method,
    data: data,
    params: params
  })
}

// 权限管理分页查询
export const reqRermissionListPage = (method, params, data) => {
  return axios.request({
    url: '/sys/permission/listPage',
    method: method,
    data: data,
    params: params
  })
}
