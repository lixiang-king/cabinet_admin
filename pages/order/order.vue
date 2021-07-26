<template>
  <view>
    <SearchHeader placeholder="设备名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="date_picker">
      <p-date-picker @start="onStartDateOk" @end="onEndDateOk"></p-date-picker>
    </view>
    <view class="statistic_total">
      <view class="total_title">
        <image src="../../static/img/manage/order_total.png" mode="widthFix"></image>
        订单总数
      </view>
      <view class="number">
        <text>{{ total }}</text>
        单
      </view>
    </view>
    <view class="order_list" v-if="dataList.length">
      <view class="list_item" v-for="item in dataList" :key="item.machineid">
        <view class="title">{{item.machine_name}}</view>
        <view class="info">
          <view class="info_item">
            <text>机器编号</text>
            <text>{{ item.machineid }}</text>
          </view>
          <view class="info_item">
            <text>商品名称</text>
            <text>{{ item.name }}</text>
          </view>
          <view class="info_item">
            <text>商品数量</text>
            <text>{{ item.buy_sum }}</text>
          </view>
          <view class="info_item">
            <text>实收价格</text>
            <text class="price">{{ item.price }}</text>
          </view>
          <view class="info_item">
            <text>支付方式</text>
            <text>{{ item.pay_type }}</text>
          </view>
          <view class="info_item">
            <text>支付时间</text>
            <text>{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
  </view>
</template>

<script>
  import {
    httpOrder
  } from '@/utils/request/api/order.js'
  export default {
    data() {
      return {
        dataList: [],
        searchName: '',
        region: [],
        startDate: '',
        endDate: '',
        total: 0
      };
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
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
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : '',
          start_date: this.startDate,
          end_date: this.endDate
        }
        const { msg } = await httpOrder(params)
        this.dataList = msg.order_info
        this.total = msg.order_count
      }
    },
    onLoad() {
      this.getDataList()
    }
  }
</script>

<style lang="less">
  .statistic_total {
    position: relative;
    width: 100%;
    height: 100rpx;
    // line-height: 100rpx;
    margin: 16rpx 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(/static/img/manage/device_total_bg.png) no-repeat;
    background-size: contain;
    font-size: 24rpx;
    color: rgba(255, 255, 255, .84);

    .total_title {
      position: absolute;
      left: 20rpx;
      top: 15rpx;
      display: flex;
      align-items: center;

      image {
        width: 25rpx;
        margin-right: 4rpx;
      }
    }

    .number {
      vertical-align: baseline;

      text {
        color: #FFFFFF;
        font-size: 60rpx;
        margin-right: 20rpx;
      }
    }

  }

  .order_list {
    // padding: 10rpx;
    // padding: 0 10rpx;
    margin: 0 10rpx;

    .list_item {
      margin-bottom: 20rpx;
      background-color: #FFFFFF;
      padding: 22rpx;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .title {
        height: 56rpx;
        line-height: 56rpx;
        text-align: center;
        color: #666666;
        border-bottom: 1rpx solid #eeeeee;
      }

      .info {
        padding-top: 20rpx;

        .info_item {
          height: 60rpx;
          display: flex;
          justify-content: space-between;
          color: #999999;
          font-size: 24rpx;

          .price {
            color: #E24653;
          }
        }
      }
    }

  }
</style>
