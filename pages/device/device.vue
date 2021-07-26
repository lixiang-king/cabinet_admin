<template>
  <view class="device_page">
    <SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="device_total">
      <view class="total_title">
        <image src="../../static/img/manage/device_total_icon.png" mode="widthFix"></image>
        设备总数
      </view>
      <view class="number">
        <text>{{ machine_sum }}</text>
        台
      </view>
    </view>
    <view class="device_list" v-if="deviceList.length">
      <view class="device_item" v-for="item in deviceList" :key="item.place_id" @click="toDetail(item.place_id)">
        <view class="txt_info">
          <text>{{ item.place }}</text>
          <text>设备总数: {{ item.machine_sum }}台</text>
        </view>
        <image src="../../static/img/manage/manage_buildings.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
    <view class="bottom_btn" @click="toAdd">
      <image src="../../static/img/manage/device_add.png" mode="widthFix"></image>
      设备入驻
    </view>
  </view>
</template>

<script>
  import {
    httpMachineInfo
  } from '@/utils/request/api/device.js'
  export default {
    data() {
      return {
        machine_sum: 0,
        deviceList: [],
        searchName: '',
        region: []
      };
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getDeviceData()
      },
      onSearch(value) {
        this.searchName = value
        this.getDeviceData()
      },
      toAdd() {
        uni.navigateTo({
          url: '/pages/device/deviceAdd'
        })
      },
      toDetail(id) {
        uni.navigateTo({
          url: '/pages/device/machineList?id=' + id
        })
      },
      async getDeviceData() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpMachineInfo(params)
        this.deviceList = msg.machine_info
        this.machine_sum = msg.machine_sum
      }
    },
    onShow() {
      this.getDeviceData()
    }
  }
</script>

<style lang="less" scoped>
  .device_page {
    padding-bottom: 100rpx;
  }

  .device_total {
    position: relative;
    width: 100%;
    height: 100rpx;
    // line-height: 100rpx;
    margin: 8rpx;
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

  .device_list {
    padding: 8rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .device_item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      width: 362rpx;
      height: 138rpx;
      border-radius: 5rpx;
      background-color: #FFFFFF;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .txt_info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: left;

        text {
          font-size: 24rpx;
          color: #afafaf;

          &:nth-of-type(1) {
            width: 200rpx;
            font-size: 30rpx;
            color: #333333;
          }
        }
      }

      image {
        width: 90rpx;
        height: 90rpx;
        margin-left: 24rpx;
      }
    }
  }
</style>
