import http from '../request.js'
// 代理管理-列表
export const httpAgentList = (data) => {
  return http.request({
    url: '/admin/index.php/channel/get_channel_list',
    method: 'POST',
    data,
  })
}
// 代理管理-添加
export const httpAgentAdd = (data) => {
  return http.request({
    url: '/admin/index.php/channel/add_channel',
    method: 'POST',
    data,
  })
}
// 代理管理-查询详情
export const httpAgentInfo = (data) => {
  return http.request({
    url: '/admin/index.php/channel/select_channel_info',
    method: 'POST',
    data,
  })
}
// 代理管理-更新
export const httpAgentUpdate = (data) => {
  return http.request({
    url: '/admin/index.php/channel/update_channel_info',
    method: 'POST',
    data,
  })
}