import http from '../request.js'
import store from '@/store/store.js'
// 我的 --> 登录
export const httpLogin = (data) => {
  return http.request({
    url: '/admin/index.php/login/index',
    method: 'POST',
    data,
  })
}
// 我的 --> 退出账户
export const httpUserLogout = (data) => {
  return http.request({
    url: '/admin/index.php/login/login_out',
    method: 'POST',
    data,
  })
}
// 我的 --> 我的信息
export const httpUserInfo = (data) => {
  return http.request({
    url: '/admin/index.php/my/my_info',
    method: 'POST',
    data,
  })
}
// 我的 --> 获取OpenId
export const httpUserOpenId = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://applet.dc-box.com/admin/index.php/my/get_user_info',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'ci_session=' + store.state.XLoginInfo.token
      },
      method: 'POST',
      data,
      success: (res) => {
        resolve(res.data)
      },
      fail: (r) => {
        reject(r)
      }
    })
  })
}
// 我的 --> 提现
export const httpUserWithdrawal = (data) => {
  return http.request({
    url: '/admin/index.php/my/withdrawal',
    method: 'POST',
    data,
  })
}
// 我的 --> 获取账户绑定信息
export const httpUserAccountInfo = (data) => {
  return http.request({
    url: '/admin/index.php/my/account_info',
    method: 'POST',
    data,
  })
}
// 我的 --> 微信账户绑定
export const httpUserWxBind = (data) => {
  return http.request({
    url: '/admin/index.php/my/wx_account_bind',
    method: 'POST',
    data,
  })
}
// 我的 --> 银行账户绑定
export const httpUserBankBind = (data) => {
  return http.request({
    url: '/admin/index.php/my/bank_account_bind',
    method: 'POST',
    data,
  })
}
// 我的 --> 修改密码
export const httpUserPwdUpdate = (data) => {
  return http.request({
    url: '/admin/index.php/my/update_password',
    method: 'POST',
    data,
  })
}
// 我的 --> 账单明细
export const httpUserBillDetail = (data) => {
  return http.request({
    url: '/admin/index.php/my/bill_detail',
    method: 'POST',
    data,
  })
}
// 角色管理 -----------------------------------------------------------------
// 运维 --> 获取运维人员列表
export const httpUserOpList = (data) => {
  return http.request({
    url: '/admin/index.php/my/operation_list',
    method: 'POST',
    data,
  })
}
// 运维 --> 添加运维人员
export const httpUserOpAdd = (data) => {
  return http.request({
    url: '/admin/index.php/my/add_operation',
    method: 'POST',
    data,
  })
}
// 运维 --> 删除
export const httpUserOpDel = (data) => {
  return http.request({
    url: '/admin/index.php/my/del_operation',
    method: 'POST',
    data,
  })
}
// 补货 --> 补货人员列表
export const httpUserBhList = (data) => {
  return http.request({
    url: '/admin/index.php/my/bh_person_list',
    method: 'POST',
    data,
  })
}
// 补货 --> 添加补货人员
export const httpUserBhAdd = (data) => {
  return http.request({
    url: '/admin/index.php/my/add_bh_person',
    method: 'POST',
    data,
  })
}
// 补货 --> 删除
export const httpUserBhDel = (data) => {
  return http.request({
    url: '/admin/index.php/my/del_bh_person',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 介绍人列表
export const httpUserIntroList = (data) => {
  return http.request({
    url: '/admin/index.php/my/introducer_list',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 添加介绍人
export const httpUserIntroAdd = (data) => {
  return http.request({
    url: '/admin/index.php/my/add_introducer',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 查看介绍人详情
export const httpUserIntroInfo = (data) => {
  return http.request({
    url: '/admin/index.php/my/introducer_info',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 绑定场地
export const httpUserIntroBind = (data) => {
  return http.request({
    url: '/admin/index.php/my/introducer_bind_place',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 解绑场地
export const httpUserIntroUnbind = (data) => {
  return http.request({
    url: '/admin/index.php/my/introducer_unbundling_place',
    method: 'POST',
    data,
  })
}
// 介绍人 --> 删除
export const httpUserIntroDel = (data) => {
  return http.request({
    url: '/admin/index.php/my/del_introducer',
    method: 'POST',
    data,
  })
}
// 营销人员 - 列表
export const httpUserMarketList = (data) => {
  return http.request({
    url: '/admin/index.php/my/marketing_list',
    method: 'POST',
    data,
  })
}
// 营销人员 - 添加
export const httpUserMarketAdd = (data) => {
  return http.request({
    url: '/admin/index.php/my/add_marketing',
    method: 'POST',
    data,
  })
}
// 营销人员 - 详情
export const httpUserMarketInfo = (data) => {
  return http.request({
    url: '/admin/index.php/my/marketing_info',
    method: 'POST',
    data,
  })
}
// 营销人员 - 绑定场地
export const httpUserMarketBind = (data) => {
  return http.request({
    url: '/admin/index.php/my/marketing_bind_place',
    method: 'POST',
    data,
  })
}
// 营销人员 - 解绑场地
export const httpUserMarketUnbind = (data) => {
  return http.request({
    url: '/admin/index.php/my/marketing_unbundling_place',
    method: 'POST',
    data,
  })
}
// 营销人员 - 删除
export const httpUserMarketDel = (data) => {
  return http.request({
    url: '/admin/index.php/my/del_marketing',
    method: 'POST',
    data,
  })
}




