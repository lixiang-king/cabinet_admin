import http from '../request.js'
// 库存 ---> 库存列表
export const httpStockList = (data) => {
  return http.request({
    url: '/admin/index.php/stock/channel_list',
    method: 'POST',
    data,
  })
}
// 库存 ---> 库存详情
export const httpStockInfo = (data) => {
  return http.request({
    url: '/admin/index.php/stock/get_stock_info',
    method: 'POST',
    data,
  })
}

// 库存 ---> 商品信息
export const httpStockGoods = (data) => {
  return http.request({
    url: '/admin/index.php/programme/get_goods_info',
    method: 'POST',
    data,
  })
}
// 库存 ---> 添加商品
export const httpStockGoodsAdd = (data) => {
  return http.request({
    url: '/admin/index.php/stock/add_stock_goods',
    method: 'POST',
    data,
  })
}

// 库存 ---> 商品信息
export const httpStockGoodsInfo = (data) => {
  return http.request({
    url: '/admin/index.php/stock/select_goods_info',
    method: 'POST',
    data,
  })
}
// 库存 ---> 入库
export const httpStockIn = (data) => {
  return http.request({
    url: '/admin/index.php/stock/stock_in',
    method: 'POST',
    data,
  })
}
// 库存 ---> 出库
export const httpStockOut = (data) => {
  return http.request({
    url: '/admin/index.php/stock/stock_out',
    method: 'POST',
    data,
  })
}
// 库存 ---> 入库记录
export const httpStockInRecord = (data) => {
  return http.request({
    url: '/admin/index.php/stock/stock_in_record',
    method: 'POST',
    data,
  })
}
// 库存 ---> 出库记录
export const httpStockOutRecord = (data) => {
  return http.request({
    url: '/admin/index.php/stock/stock_out_record',
    method: 'POST',
    data,
  })
}