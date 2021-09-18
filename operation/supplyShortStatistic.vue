<template>
  <view class="total_page">
    <view class="title c_border_btm">
      <view class="p_title">总计</view>
      <view class="c_ac_color">{{ total_sum }}</view>
    </view>
    <view class="list">
      <view class="list_item c_border_btm" v-for="item in dataList" :key="item.pid" @click="toDetail(item)">
        <image :src="item.small_img" mode="widthFix"></image>
        <view class="info">
          <view>{{ item.goods_name }}</view>
          <view>缺货数量：<text class="c_ac_color">{{ item.shortage_num }}</text></view>
        </view>
        <view class="op">>️</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    httpOpStockoutSta
  } from '@/utils/request/api/operation.js'
  export default {
    data() {
      return {
        idstr: '',
        dataList: [],
        total_sum: 0
      };
    },
    methods: {
      toDetail(item) {
        uni.navigateTo({
          url: '/operation/supplyShortMachine?id=' + item.pid + '&pname=' + item.goods_name
        })
      },
      async getDataInfo() {
        const params = {
          machineid_str: this.idstr
        }
        const { msg } = await httpOpStockoutSta(params)
        this.total_sum = msg.shortage_num
        this.dataList = msg.shortage_goods_info
      }
    },
    onLoad(option) {
      this.idstr = JSON.parse(decodeURIComponent(option.ids))
      this.getDataInfo()
    }
  }
</script>

<style lang="less">
  .total_page {
    margin: 15rpx;
    padding: 15rpx;
    background-color: #FFFFFF;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70rpx;
    }

    .list {
      .list_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 15rpx;

        &:nth-last-of-type(1) {
          border: none;
        }

        image {
          width: 90rpx;
          width: 90rpx;
          margin-right: 30rpx;
        }

        .info {
          width: 540rpx;
          display: flex;
          flex-direction: column;
          align-items: left;

          view {
            &:nth-of-type(1) {
              font-weight: bold;
              margin-bottom: 10rpx;
            }

            &:nth-of-type(2) {
              color: #333333;
              font-size: 24rpx;
            }
          }
        }

        .op {
          font-size: 40rpx;
          color: #999999;
        }
      }
    }
  }
</style>
