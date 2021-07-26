import http from '../request.js'
// 订单管理
export const httpOrder = (data) => {
  return http.request({
    url: '/admin/index.php/order/get_order',
    method: 'POST',
    data,
  })
}