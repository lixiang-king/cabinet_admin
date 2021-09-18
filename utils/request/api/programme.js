import http from '../request.js'
// 方案管理-列表
export const httpProList = (data) => {
  return http.request({
    url: '/admin/index.php/programme/programme_list',
    method: 'POST',
    data,
  })
}
// 方案管理-获取方案信息(添加方案页面数据)
export const httpProInfo = (data) => {
  return http.request({
    url: '/admin/index.php/programme/get_programme_info',
    method: 'POST',
    data,
  })
}
// 方案管理-提交方案信息
export const httpProAdd = (data) => {
  return http.request({
    url: '/admin/index.php/programme/programme_add',
    method: 'POST',
    data,
  })
}
// 方案管理-方案编辑(查询方案信息)
export const httpProInfoById = (data) => {
  return http.request({
    url: '/admin/index.php/programme/programme_info',
    method: 'POST',
    data,
  })
}
// 方案管理-更新方案信息
export const httpProUpdate = (data) => {
  return http.request({
    url: '/admin/index.php/programme/programme_update',
    method: 'POST',
    data,
  })
}
// 方案管理-获取商品信息
export const httpProGoods = (data) => {
  return http.request({
    url: '/admin/index.php/programme/get_goods_info',
    method: 'POST',
    data,
  })
}