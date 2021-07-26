import http from '../request.js'
// 设备管理
export const httpMachineInfo = (data) => {
  return http.request({
    url: '/admin/index.php/machine/get_machine_info',
    method: 'POST',
    data,
  })
}
// 设备管理-列表
export const httpMachineList = (data) => {
  return http.request({
    url: '/admin/index.php/machine/get_machine_list',
    method: 'POST',
    data,
  })
}
// 获取点位列表
export const httpPlaceInfo = (data) => {
  return http.request({
    url: '/admin/index.php/machine/get_place_info',
    method: 'POST',
    data,
  })
}
// 设备入驻
export const httpMachineSettle = (data) => {
  return http.request({
    url: '/admin/index.php/machine/machine_settle',
    method: 'POST',
    data,
  })
}