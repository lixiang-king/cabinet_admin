<template>
  <view class="account">
    <view class="wx-binding">
      <view class="p_title">
        <view class="p_title1">微信绑定—</view>
        <view class="p_title2">{{ accountInfo.nickName ? '已绑定' : '未绑定'}}</view>
      </view>
      <view class="p_image" v-if="!accountInfo.nickName">
        <button class="wx_btn" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
        <image src="../../static/img/user/user-binding-wx.png" mode="widthFix"></image>
        <view class='image_info'>点击绑定微信</view>
      </view>
      <view class="p_image" v-else>
        <image :src="accountInfo.avatarUrl" mode="widthFix"></image>
        <view class='image_info'>
          {{ accountInfo.nickName }}
        </view>
      </view>
    </view>
    <view class="card-binding">
      <view class="p_title">
        <view class="p_title1">银行卡—</view>
        <view class="p_title2">{{ accountInfo.bank_card_num ? '已绑定' : '未绑定'}}</view>
      </view>
      <view class="card_info">
        <view class="card_item">
          <view class="card_key">持卡人姓名</view>
          <input type="text" v-model="accountInfo.bank_person_name" placeholder="填写持卡人姓名" placeholder-style="font-size:24rpx" />
        </view>
        <view class="card_item">
          <view class="card_key">卡号</view>
          <input type="text" v-model="accountInfo.bank_card_num" placeholder="填写银行卡号" placeholder-style="font-size:24rpx" />
        </view>
        <view class="card_item">
          <view class="card_key">银行名称</view>
          <input type="text" v-model="accountInfo.bank_name" placeholder="填写银行名称" placeholder-style="font-size:24rpx" />
        </view>
      </view>
      <view class="binding" @click="cardBinding">
        <view class="cardBinding">绑定银行卡</view>
      </view>
    </view>
  </view>
</template>
<script>
  import {
    httpUserAccountInfo,
    httpUserBankBind,
    httpUserWxBind,
    httpUserOpenId
  } from '@/utils/request/api/user.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    computed: {
      ...mapState(['XOpenId']),
    },
    data() {
      return {
        isBinding_wx: '未绑定',
        wx_name: '点击绑定微信',
        isBinding_card: '未绑定',
        codeRes: '',
        userInfoRes: {},
        accountInfo: {
          nickName: '',
          avatarUrl: '',
          bank_card_num: '',
          bank_name: '',
          bank_person_name: ''
        }
      }
    },
    methods: {
      ...mapMutations(['setOpenId']),
      handleOpenId (code) {
        httpUserOpenId({ code }).then(res => {
          this.setOpenId(res.openid)
          this.getWxBind()
        }).catch(r => {
          uni.showToast({
            title: '获取openId失败'
          })
        })
      },
      getUserInfo(e) {
        uni.login({
          provider: 'weixin',
          success: loginRes => {
            this.codeRes = loginRes.code
            // 获取用户信息
            uni.getUserInfo({
              provider: 'weixin',
              success: res => {
                this.userInfoRes = res.userInfo
                console.log(res)
                this.handleOpenId(loginRes.code)
              }
            })
          }
        })
      },
      getWxBind() {
        const params = {
          nickName: this.userInfoRes.nickName,
          avatarUrl: this.userInfoRes.avatarUrl,
          openid: this.XOpenId
        }
        httpUserWxBind(params).then(res => {
          uni.showToast({
            title: '绑定成功'
          })
          this.getAccountDetail()
        })
      },
      cardBinding() {
        const params = {
          bank_card_num: this.accountInfo.bank_card_num,
          bank_name: this.accountInfo.bank_name,
          bank_person_name: this.accountInfo.bank_person_name
        }
        httpUserBankBind(params).then(res => {
          uni.showToast({
            title: '绑定成功'
          })
        })
      },
      async getAccountDetail() {
        const { msg } = await httpUserAccountInfo()
        this.accountInfo = msg.account_info
      }
    },
    onLoad() {
      this.getAccountDetail()
    }
  }
</script>
<style lang="less" scoped>
  .wx-binding {
    height: 327rpx;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    margin-top: 12rpx;
    margin-bottom: 12rpx;
  }

  .card-binding {
    height: 400rpx;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    margin-top: 20rpx;
  }

  .p_title {
    display: flex;
    position: relative;
    font-size: 30rpx;
    background-color: #FFFFFF;
    margin: 20rpx 0 35rpx 15rpx;

    .p_title1 {
      margin-left: 12rpx;
    }

    .p_title2 {
      opacity: 0.5;
    }

    &::before {
      content: "";
      width: 6rpx;
      height: 30rpx;
      background: #FF544A;
      border-radius: 3rpx;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .p_image {
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-color: red;
    position: relative;

    .wx_btn {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: transparent;

      &::after {
        border: none;
      }
    }

    image {
      width: 160rpx;
    }

    .image_info {
      font-size: 24rpx;
      color: #444444;
      opacity: 0.5;
      margin-top: 15rpx;
    }
  }

  .card_info {
    margin: 0 10rpx;

    .card_item {
      display: flex;
      width: 720rpx;
      margin: auto;
      border-bottom: 1rpx solid #B5B5B5;
      margin-bottom: 15rpx;

      .card_key {
        font-size: 30rpx;
        width: 200rpx;
        margin-left: 30rpx;
      }

      input {
        width: 500rpx;
      }
    }
  }

  .binding {
    width: 730rpx;
    height: 71rpx;
    background: #FF8D36;
    border-radius: 5px;
    margin: 20rpx 10rpx 30rpx 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .cardBinding {
      font-size: 30rpx;
      color: #FFFFFF;
    }
  }
</style>
