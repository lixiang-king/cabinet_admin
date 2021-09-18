import http from '../request.js'
// 运维管理--->灯光设置
export const httpOpLight = (data) => {
  return http.request({
    url: '/admin/index.php/operate/lighting_set',
    method: 'POST',
    data,
  })
}
// 运维管理--->设备测试
export const httpOpDeviceTest = (data) => {
  return http.request({
    url: '/admin/index.php/operate/machine_test',
    method: 'POST',
    data,
  })
}
// 运维管理--->设备解绑
export const httpOpUnbind = (data) => {
  return http.request({
    url: '/admin/index.php/operate/machine_unbundling',
    method: 'POST',
    data,
  })
}
// 更新电量
export const httpOpElectric = (data) => {
  return http.request({
    url: '/admin/index.php/operate/update_machine_electric',
    method: 'POST',
    data,
  })
}
// 补货----------------------------------------------------------------------------------
// 运维管理--->获取补货管理列表
export const httpOpReplenishList = (data) => {
  return http.request({
    url: '/admin/index.php/operate/bh_manage',
    method: 'POST',
    data,
  })
}
// 运维管理--->获取缺货管理列表 --> 补货详情
export const httpOpReplenishDetail = (data) => {
  return http.request({
    url: '/admin/index.php/operate/place_qh_info',
    method: 'POST',
    data,
  })
}
// 运维管理--->补货操作 - 列表
export const httpOpReplenishOpList = (data) => {
  return http.request({
    url: '/admin/index.php/operate/machine_qh_info',
    method: 'POST',
    data,
  })
}
// 运维管理--->补货操作 - 确认
export const httpOpReplenishOpConfirm = (data) => {
  return http.request({
    url: '/admin/index.php/operate/machine_bh',
    method: 'POST',
    data,
  })
}
// 缺货统计----------------------------------------------------------------------------------


// 运维管理--->获取缺货统计列表
export const httpOpStockoutDeviceSta = (data) => {
  return http.request({
    url: '/admin/index.php/operate/shortage_machine_list',
    method: 'POST',
    data,
  })
}
// 运维管理--->商品缺货统计
export const httpOpStockoutSta = (data) => {
  return http.request({
    url: '/admin/index.php/operate/goods_shortage_count',
    method: 'POST',
    data,
  })
}
// 运维管理--->商品缺货机器列表
export const httpOpStockoutDevice = (data) => {
  return http.request({
    url: '/admin/index.php/operate/machine_shortage_count',
    method: 'POST',
    data,
  })
}
// 运维管理--->未扫码预警
export const httpOpUnscan = (data) => {
  return http.request({
    url: '/admin/index.php/operate/not_scan_machine',
    method: 'POST',
    data,
  })
}
// 运维管理--->电量预警
export const httpOpBattery = (data) => {
  return http.request({
    url: '/admin/index.php/operate/battery_info',
    method: 'POST',
    data,
  })
}