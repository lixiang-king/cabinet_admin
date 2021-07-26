<template>
  <view class="money">
    <view class="statistic_total">
      <view class="total_title">
        <image src="../../static/img/user/money-price.png" mode="widthFix"></image>
        可提现金额（元）
      </view>
      <view class="number">
        <text class="price1">￥</text>
        <text>{{ XUserInfo.surplus_price }}</text>
      </view>
    </view>
    <view class="icon_box c_box_shadow">
      <view class="box_title c_border_btm">提现到</view>
      <view class="icon_list">
        <view class="icon_item" @click="onSelectType(2)">
          <image :src="acType === 2 ? cardiconon : cardicon" mode="widthFix"></image>
          <view :class="[acType === 2 ? 'acColor' : '']">银行卡</view>
        </view>
        <view class="icon_item" @click="onSelectType(1)">
          <image :src="acType === 1 ? wxiconon : wxicon" mode="widthFix"></image>
          <view :class="[acType === 1 ? 'acColor' : '']">微信</view>
        </view>
      </view>
    </view>
    <view class="cash_box c_box_shadow">
      <view class="box_title c_border_btm">提现金额</view>
      <view class="cash_form">
        <view class="cash_form_item">
          <text>￥</text>
          <input type="text" placeholder="请输入提现金额" v-model="withdrawal_price" />
        </view>
        <view class="cash_all_btn" @click="allMoney">全部提现</view>
      </view>
    </view>
    <view class="getMoney" @click="onSumbit">
      <view class="current-money">立即提现</view>
    </view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    httpUserWithdrawal
  } from '@/utils/request/api/user.js'
  export default {
    computed: {
      ...mapState([
        'XUserInfo'
      ])
    },
    data() {
      return {
        acType: 1, // 1微信 2银行卡
        wxicon: require('../../static/img/user/money-price-weixin.png'),
        wxiconon: require('../../static/img/user/money-price-weixin-on.png'),
        cardicon: require('../../static/img/user/money-price-card.png'),
        cardiconon: require('../../static/img/user/money-price-card-on.png'),
        withdrawal_price: null
      }
    },
    methods: {
      onSelectType(type) {
        this.acType = type
      },
      allMoney() {
        this.withdrawal_price = this.XUserInfo.surplus_price
      },
      onSumbit() {
        const params = {
          type: this.acType,
          withdrawal_price: this.withdrawal_price
        }
        httpUserWithdrawal(params).then(res => {
          uni.navigateTo({
            url: '/pages/user/moneySuccess?type=' + this.acType + '&price=' + this.withdrawal_price
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .statistic_total {
    width: 730rpx;
    height: 179rpx;
    background: #FF5449;
    border-radius: 10px;
    position: relative;
    margin: 22rpx 10rpx 0rpx 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: contain;
    font-size: 24rpx;
    color: rgba(255, 255, 255, .84);

    .total_title {
      position: absolute;
      left: 22rpx;
      top: 22rpx;
      display: flex;
      align-items: center;

      image {
        width: 30rpx;
        margin-right: 4rpx;
      }
    }

    .number {
      vertical-align: baseline;
      position: absolute;
      top: 70rpx;
      left: 243rpx;

      text {
        color: #FFFFFF;
        font-size: 60rpx;
        margin-right: 20rpx;
      }

      .price1 {
        font-size: 30rpx;
      }
    }
  }

  .form_item {
    height: 80rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    border-bottom: 1rpx solid #b5b5b5;

    .label {
      width: 160rpx;
      text-align: left;
      font-size: 30rpx;
      margin-right: 60rpx;
      color: rgba(0, 0, 0, 0.8);
    }
  }

  .icon_box {
    background: #FAFAFA;
    border-radius: 10px;
    margin: 20rpx 10rpx 0 10rpx;
    padding: 20rpx;

    .box_title {
      height: 60rpx;
      line-height: 60rpx;
      font-weight: bold;
    }

    .icon_list {
      display: flex;
      align-items: center;
      padding: 50rpx;

      .icon_item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;

        image {
          width: 170rpx;
        }

        .acColor {
          color: #dd6959;
        }
      }
    }
  }

  .cash_box {
    background: #FAFAFA;
    border-radius: 10px;
    margin: 20rpx 10rpx 0 10rpx;
    padding: 0 20rpx;

    .box_title {
      height: 60rpx;
      line-height: 60rpx;
      font-weight: bold;
    }

    .cash_form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;

      .cash_form_item {
        display: flex;
        align-items: flex-end;

        text {
          font-size: 60rpx;
          font-weight: 300;
        }

        input {
          height: 60rpx;
          font-size: 30rpx;
        }

        .cash_all_btn {
          color: #ef7d71;
        }
      }

      .cash_all_btn {
        color: #ef7d71;
      }
    }
  }

  .getMoney {
    width: 730rpx;
    height: 71rpx;
    background: #FF8D35;
    border-radius: 5px;
    margin: 90rpx 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .current-money {
      font-size: 30rpx;
      color: #FFFFFF;
    }
  }
</style>
