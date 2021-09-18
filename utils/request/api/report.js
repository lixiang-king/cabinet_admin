import http from '../request.js'
// 日报
export const httpReportDaily = (data) => {
  return http.request({
    url: '/admin/index.php/operate/operate_daily',
    method: 'POST',
    data,
  })
}
// 周报
export const httpReportWeekly = (data) => {
  return http.request({
    url: '/admin/index.php/operate/operate_weekly',
    method: 'POST',
    data,
  })
}
// 月报
export const httpReportMonthly = (data) => {
  return http.request({
    url: '/admin/index.php/operate/operate_monthly',
    method: 'POST',
    data,
  })
}
// 根据机器编号获取商品销售信息
export const httpMachine4Goods = (data) => {
  return http.request({
    url: '/admin/index.php/operate/get_goods_sale_info',
    method: 'POST',
    data,
  })
}
// 根据商品编号获取机器销售信息
export const httpGoods4Machine = (data) => {
  return http.request({
    url: '/admin/index.php/operate/get_machine_sale_info',
    method: 'POST',
    data,
  })
}
// 根据城市名称获取场地方信息
export const httpCity4Place = (data) => {
  return http.request({
    url: '/admin/index.php/operate/get_city_place',
    method: 'POST',
    data,
  })
}
// 根据场地方名称获取设备信息
export const httpPlace4Machine = (data) => {
  return http.request({
    url: '/admin/index.php/operate/get_place_machine',
    method: 'POST',
    data,
  })
}