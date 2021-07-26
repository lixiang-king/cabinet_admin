import http from '../request.js'
// 设备管理
export const httpStatisInfo = (data) => {
  return http.request({
    url: '/admin/index.php/sale/sale_info',
    method: 'POST',
    data
  })
}
