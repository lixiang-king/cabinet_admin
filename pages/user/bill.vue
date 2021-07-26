<template>
  <view class="bill">
    <view class="in-out">
      <view class="item_in">
        <text @click="onStyle(1)" :class="['selected',acType===1?'active':'']">收入</text>
      </view>
      <view class="item_out">
        <text @click="onStyle(2)" :class="['selected',acType===2?'active':'']">提现记录</text>
      </view>
    </view>
    <view class="bill-info">
      <view class="date_picker">
        <p-date-picker @start="onStartDateOk" @end="onEndDateOk"></p-date-picker>
      </view>
      <view class="current-money">
        <view class="label">当前金额</view>
        <view class="value">
          <text class="current_money">￥{{ XUserInfo.surplus_price ? XUserInfo.surplus_price : 0 }}</text>
        </view>
      </view>
    </view>
    <view v-if="acType === 1">
      <view class="bill-list" v-if="incomeList.length">
        <view class="bill-item" v-for="item in incomeList" :key="item.order_num">
          <view class="list-left">
            <image src="../../static/img/user/bill-detail.png" mode="widthFix"></image>
          </view>
          <view class="list-center">
            <view class="bill_order_number">
              订单号：{{item.order_num}}
            </view>
            <view class="bill_time">
              付款时间：{{item.time}}
            </view>
          </view>
          <view class="list-right">￥{{item.share_price}}</view>
        </view>
      </view>
      <view class="c_empty_box" v-else>
        <image src="../../static/img/public/empty.png" mode="widthFix"></image>
        暂无内容
      </view>
    </view>
    <view v-if="acType === 2">
      <view class="bill-list" v-if="withdrawal_record.length">
        <view class="bill-item" v-for="(item, index) in withdrawal_record" :key="index">
          <view class="list-left">
            <image src="../../static/img/user/bill-detail.png" mode="widthFix"></image>
          </view>
          <view class="list-center">
            <view class="bill_order_number">
              提现类型：{{item.tx_type}}
            </view>
            <view class="bill_time">
              付款时间：{{item.time}}
            </view>
          </view>
          <view class="list-right">￥{{item.tx_price}}</view>
        </view>
      </view>
      <view class="c_empty_box" v-else>
        <image src="../../static/img/public/empty.png" mode="widthFix"></image>
        暂无内容
      </view>
    </view>

  </view>
</template>
<script>
  import {
  	mapState
  } from 'vuex'
  import {
    httpUserBillDetail
  } from '../../utils/request/api/user.js'
  export default {
    computed: {
    	...mapState([
    		'XUserInfo'
    	])
    },
    data() {
      return {
        acType: 1,
        startDate: '',
        endDate: '',
        current_money: "2341.00",
        withdrawal_record: [],
        incomeList: []
      }
    },
    methods: {
      onStyle(type) {
        this.acType = type
      },
      onStartDateOk(date) {
        this.startDate = date
        this.getDataList()
      },
      onEndDateOk(date) {
        this.endDate = date
        this.getDataList()
      },
      async getDataList() {
        const { msg } = await httpUserBillDetail()
        this.incomeList = msg.income
        this.withdrawal_record = msg.withdrawal_record
      }
    },
    onLoad() {
      this.getDataList()
    }
  }
</script>
<style lang="less" scoped>
  .in-out {
    width: 750rpx;
    height: 80rpx;
    background: #FF544A;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color: #FFFFFF;

    .item_in,
    .item_out {
      width: 50%;
      text-align: center;

      .selected.active {
        padding-bottom: 18rpx;
        border-bottom: 1rpx solid #FFFFFF;
      }
    }
  }

  .bill-info {
    display: flex;
    flex-direction: column;
    margin-bottom: 15rpx;

    .current-money,
    .date_picker_page {
      padding: 0 30rpx;
      height: 70rpx;
      background-color: #FFFFFF;
      display: flex;
      align-items: center;
      color: #bcbcbc;
      font-size: 30rpx;

      .label {
        width: 120rpx;
        margin-right: 36rpx;
        color: #595959;
      }

      .value {
        width: 400rpx;
        display: flex;
        align-items: center;

        margin-left: 50rpx;
      }

      .current_money {
        color: #FF544A;
      }
    }
  }

  .bill-list {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;

    .bill-item {
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #BFBFBF;
    }

    .list-left {
      width: 98rpx;
      height: 98rpx;
      background: #FF8D36;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 25rpx;

      image {
        width: 76rpx;
      }
    }

    .list-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      // margin-top: 25rpx;
      margin-right: 100rpx;

      .bill_name {
        font-size: 30rpx;
        font-weight: 600;
      }

      .bill_order_number,
      .bill_time {
        margin: 3rpx 0rpx;
        font-size: 20rpx;
      }
    }

    .list-right {
      font-size: 30rpx;
      color: #FF544A;
      // margin: 90rpx 20rpx 28rpx 0rpx;
    }
  }
</style>
