<template>
  <view class="power_page">
    <view class="query_box">
      <SearchHeader placeholder="机器名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
      <view class="query_item query_position">
        <view class="label">点位</view>
        <pSelect :range="placeList" @pickOk="onPlacePickOk"></pSelect>
      </view>
      <view class="query_item query_power">
        <view class="label">电量</view>
        <pSelect rangeKey="text" :range="not_san_type_list" @pickOk="onSancTypeOk"></pSelect>
      </view>
    </view>
    <view class="machine_box" v-if="dataList.length">
      <view class="title">
        <view>设备名称</view>
        <view>未扫码时间</view>
      </view>
      <view class="machine_list">
        <view class="list_item" v-for="item in dataList" :key="item.machine_name">
          <text>{{ item.machine_name }}</text>
          <view>{{ item.not_scan_day }}</view>
        </view>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
  </view>
</template>

<script>
  import {
    httpOpUnscan
  } from '@/utils/request/api/operation.js'
  import {
    httpPlaceInfo
  } from '@/utils/request/api/device.js'
  export default {
    data() {
      return {
        region: ['', '', ''],
        searchName: '',
        dataList: [],
        not_san_type_list: [],
        not_scan_type: '',
        place_id: '',
        placeList: []
      }
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getPlaceInfo()
      },
      onSearch(value) {
        this.searchName = value
        this.getPlaceInfo()
      },
      onPlacePickOk(obj) {
        this.place_id = obj.place_id
        this.getDataList()
      },
      onSancTypeOk(obj) {
        this.not_scan_type = obj.value
        this.getDataList()
      },
      async getPlaceInfo() {
        const params = {
          place_name: this.searchName,
          province: this.region[0],
          city: this.region[1],
          area: this.region[2]
        }
        const { msg } = await httpPlaceInfo()
        const placeList = msg.place_info
        placeList.unshift({ place: '全部', place_id: null })
        this.placeList = placeList
        this.getDataList()
      },
      async getDataList() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0],
          city: this.region[1],
          area: this.region[2],
          not_scan_type: this.not_scan_type === -1 ? '' : this.not_scan_type,
          place_id: this.place_id
        }
        const { msg } = await httpOpUnscan(params)
        const obj = {
          value: -1,
          text: '全部'
        }
        this.not_san_type_list = msg.not_scan_type
        this.not_san_type_list.unshift(obj)
        this.dataList = msg.not_scan_machine
      },
    },
    onLoad(option) {
      this.getPlaceInfo()
    }
  }
</script>

<style lang="less" scoped>
  .power_page {
    .query_item {
      display: flex;
      align-items: center;
      padding: 18rpx;
      border-top: 1rpx solid #dddddd;
      background-color: #FFFFFF;

      .label {
        width: 120rpx;
        padding-left: 18rpx;
        color: #595959;
      }

      .value {
        color: #999999;
        // padding-left: 30rpx;
      }
    }

    .machine_box {
      background-color: #FFFFFF;
      margin: 15rpx;
      padding: 15rpx;
      border-radius: 5rpx;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .title {
        display: flex;
        padding: 15rpx;
        justify-content: space-between;
        border-bottom: 1rpx solid #cccccc;
        font-size: 30rpx;
      }

      .machine_list {

        .list_item {
          padding: 20rpx 15rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #818181;
          font-size: 30rpx;
          view {
            padding: 0 10rpx;
            width: 145rpx;
            background-color: #FF7D14;
            color: #FFFFFF;
            text-align: center;
            border-radius: 5rpx;
          }
        }
      }
    }

  }
</style>
