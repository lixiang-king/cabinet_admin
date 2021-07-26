<template>
  <view class="user_page">
    <view class="page_bg">
      <image class="bg_img" src="../../static/img/user/banner.png" mode=""></image>
      <image class="avatar" :src="XLoginInfo.headerimg_url" mode=""></image>
    </view>
    <view class="user_info">
      {{ XUserInfo.name }}
    </view>
    <view class="cash">
      <view class="price">
        ¥<text>{{ XUserInfo.surplus_price ? XUserInfo.surplus_price : 0 }}</text>
      </view>
      <view class="btn">
        <image class="cash_icon" src="../../static/img/user/cash.png" mode=""></image>
        <view class="getPrice" @click="getPrice">
          提现
        </view>
      </view>
    </view>
    <view class="option">
      <view class="op_item" v-for="item in optionList" :key="item.path" v-if="rootList.includes(item.type)" @click="toDetail(item.path)">
        <image :src="item.icon" mode=""></image>
        {{ item.title }}
      </view>
    </view>
  </view>
</template>
<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    httpUserInfo,
    httpUserLogout
  } from '@/utils/request/api/user.js'
  export default {
    computed: {
      ...mapState([
        'XUserInfo',
        'XLoginInfo'
      ]),
      rootList() {
        // 1账单明细 2账户绑定 3角色管理 4营销人员 5修改密码 6退出账号
        const {
          level,
          role
        } = this.XLoginInfo
        if (level === '1' && role === '1') {
          return [1, 2, 3, 5, 6]
        } else if (role === '2') {
          return [5, 6]
        } else if (role === '3') {
          return [5, 6]
        } else if (level === '4') {
          return [1, 2, 5, 6]
        } else if (level === '6') {
          return [1, 2, 4, 5, 6]
        } else {
          return [1, 2, 3, 4, 5, 6]
        }
      }
    },
    data() {
      return {
        optionList: [{
            type: 1,
            title: '账单明细',
            icon: '../../static/img/user/option_01.png',
            path: '/pages/user/bill'
          },
          {
            type: 2,
            title: '账户绑定',
            icon: '../../static/img/user/option_02.png',
            path: '/pages/user/account'
          },
          {
            type: 3,
            title: '角色管理',
            icon: '../../static/img/user/option_03.png',
            path: '/pages/user/role'
          },
          {
            type: 4,
            title: '营销人员',
            icon: '../../static/img/user/option_04.png',
            path: '/pages/user/roleList?type=4',
          },
          {
            type: 5,
            title: '修改密码',
            icon: '../../static/img/user/option_06.png',
            path: '/pages/user/resetPwd'
          },
          {
            type: 6,
            title: '退出账号',
            icon: '../../static/img/user/option_07.png',
            path: false
          }
        ]
      }
    },
    methods: {
      ...mapMutations(['setUserInfo', 'setLoginInfo', 'setIsLogin']),
      toDetail(path) {
        if (path) {
          uni.navigateTo({
            url: path
          })
        } else {
          uni.showModal({
            title: '退出系统',
            content: '确定退出系统吗？',
            success: res => {
              if (res.confirm) {
                this.handleLogout()
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          })
        }
      },
      handleLogout() {
        httpUserLogout()
        this.setIsLogin(false)
        this.setLoginInfo({})
        uni.navigateTo({
          url: '/pages/login/login'
        })
      },
      getPrice() {
        uni.navigateTo({
          url: '/pages/user/money'
        })
      },
      async getDataInfo() {
        const {
          msg
        } = await httpUserInfo()
        this.setUserInfo(msg.my_info)
      }
    },
    onShow() {
      this.getDataInfo()
    },
  }
</script>
<style lang="less" scoped>
  .user_page {
    background-color: #FFFFFF;

    .page_bg {
      position: relative;

      .bg_img {
        width: 100%;
        height: 296rpx;
      }

      .avatar {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 144rpx;
        height: 144rpx;
        border-radius: 50%;
      }
    }

    .user_info {
      color: #434343;
      font-size: 24rpx;
      text-align: center;
      margin-top: 18rpx;
      margin-bottom: 36rpx;
    }

    .cash {
      box-sizing: border-box;
      margin: auto;
      width: 730rpx;
      height: 80rpx;
      background: #FF5449;
      border-radius: 10px;
      padding: 0 40rpx;
      display: flex;
      justify-content: space-between;
      color: #FFFFFF;

      .price {
        text {
          font-size: 50rpx;
        }
      }

      .btn {
        display: flex;
        align-items: center;

        image {
          width: 36rpx;
          height: 36rpx;
          margin-right: 10rpx;
        }
      }
    }

    .option {
      padding: 0 28rpx;

      .op_item {
        display: flex;
        align-items: center;
        padding: 30rpx 0;
        border-bottom: 0.5rpx solid #cccccc;
        font-size: 30rpx;
        opacity: 0.85;
        font-weight: 300;

        &:nth-of-type(7) {
          border: none;
        }

        image {
          margin-right: 14rpx;
          width: 33rpx;
          height: 33rpx;
        }
      }
    }
  }
</style>
