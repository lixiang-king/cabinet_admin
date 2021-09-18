import http from '../request.js'
// 点位管理 ---> 列表
export const httpPlaceList = (data) => {
  return http.request({
    url: '/admin/index.php/place/get_place_list',
    method: 'POST',
    data,
  })
}
// 点位管理 ---> 添加
export const httpPlaceAdd = (data) => {
  return http.request({
    url: '/admin/index.php/place/add_place',
    method: 'POST',
    data,
  })
}
// 点位管理 ---> 获取点位信息
export const httpPlaceInfo = (data) => {
  return http.request({
    url: '/admin/index.php/place/get_place_info',
    method: 'POST',
    data,
  })
}
// 点位管理 ---> 修改
export const httpPlaceUpdate = (data) => {
  return http.request({
    url: '/admin/index.php/place/update_place_info',
    method: 'POST',
    data,
  })
}
// 点位管理 ---> 数据统计
export const httpPlaceSta = (data) => {
  return http.request({
    url: '/admin/index.php/place/place_data_statistics',
    method: 'POST',
    data,
  })
}

// 库存 ---> 库存详情
export const httpStockInfo = (data) => {
  return http.request({
    url: '/admin/index.php/place/stock_info',
    method: 'POST',
    data,
  })
}
// 库存 ---> 商品信息
export const httpStockGoods = (data) => {
  return http.request({
    url: '/admin/index.php/place/select_goods_info',
    method: 'POST',
    data,
  })
}
// 库存 ---> 入库
export const httpStockIn = (data) => {
  return http.request({
    url: '/admin/index.php/place/stock_in',
    method: 'POST',
    data,
  })
}
// 库存 ---> 出库
export const httpStockOut = (data) => {
  return http.request({
    url: '/admin/index.php/place/stock_out',
    method: 'POST',
    data,
  })
}
// 库存 ---> 入库记录
export const httpStockInRecord = (data) => {
  return http.request({
    url: '/admin/index.php/place/stock_in_record',
    method: 'POST',
    data,
  })
}
// 库存 ---> 出库记录
export const httpStockOutRecord = (data) => {
  return http.request({
    url: '/admin/index.php/place/stock_out_record',
    method: 'POST',
    data,
  })
}