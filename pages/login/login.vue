<template>
  <view class="login_page">
    <image class="logo" src="../../static/img/user/login_logo.png" mode="widthFix"></image>
    <view class="login_form">
      <view class="form_item">
        <image src="../../static/img/user/login_user.png" mode="widthFix"></image>
        <input class="user_name" type="text" v-model="loginForm.username" placeholder="请输入账号" />
      </view>
      <view class="form_item">
        <image src="../../static/img/user/login_pwd.png" mode="widthFix"></image>
        <input type="password" v-model="loginForm.password" placeholder="请输入密码" />
      </view>
    </view>
    <view class="login_btn" @click="onLogin">登录</view>
    <view class="login_tips">
      *仅为公司客户的登录使用
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { httpLogin } from '@/utils/request/api/user.js'
export default {
  computed: {
    ...mapState(['XIsLogin', 'XLoginForm'])
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setLoginInfo', 'setIsLogin', 'setLoginForm']),
    onLogin () {
      if (!this.loginForm.username || !this.loginForm.password) {
        return uni.showToast({
          title: '请输入账号信息',
          icon: 'none'
        })
      }
      httpLogin(this.loginForm).then(res => {
        this.setLoginInfo(res)
        this.setIsLogin(true)
        this.setLoginForm(this.loginForm)
        console.log(49)
        uni.switchTab({
          url: '/pages/index/index'
        })
      })
        .catch(r => {
          uni.showToast({
            title: '登录失败',
            icon: 'none'
          })
        })
    },
    onInputUser (e) {
      this.loginForm.username = e.target.value
    },
    onInputPwd (e) {
      this.loginForm.password = e.target.value
    }
  },
  onShow () {
    if (this.XIsLogin) {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  watch: {
    XLoginForm: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.loginForm = newValue
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.login_page {
  width: 750rpx;
  height: calc(100vh);
  background: url(../../static/img/public/login_bg.png) no-repeat;
  background-size: 100% auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .nav_bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    // padding-bottom: 15rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #ffffff;
  }
  .logo {
    width: 145rpx;
    margin-top: 150rpx;
  }
  .login_form {
    margin-top: 230rpx;
    width: 556rpx;
    display: flex;
    flex-direction: column;
    .form_item {
      width: 100%;
      display: flex;
      margin-top: 50rpx;
      color: #999999;
      border-bottom: 1rpx solid #dddddd;
      input {
        width: 540rpx;
        &.user_name {
          font-size: 36rpx;
        }
      }
      image {
        width: 44rpx;
        margin-right: 36rpx;
      }
    }
  }
  .login_btn {
    margin-top: 140rpx;
    width: 610rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background-color: #ff5449;
    border-radius: 45rpx;
    color: #ffffff;
    font-size: 36rpx;
  }
  .login_tips {
    margin-top: 40rpx;
    color: #999999;
  }
}
</style>
