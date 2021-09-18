<template>
  <view class="power_page">
    <view class="query_box">
      <SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
      <view class="query_item query_position">
        <view class="label">点位</view>
        <pSelect :range="placeList" @pickOk="onPlacePickOk"></pSelect>
      </view>
      <view class="query_item query_power">
        <view class="label">电量</view>
        <pSelect rangeKey="text" :range="electric_type_list" @pickOk="onEelecPickOk" ></pSelect>
      </view>
    </view>
    <view class="machine_box" v-if="dataList.length">
      <view class="title">
        <view>设备名称</view>
        <view class="electric">电量</view>
      </view>
      <view class="machine_list">
        <view class="list_item" v-for="item in dataList" :key="item.machine_name">
          {{ item.machine_name }}
          <view class="electric">
            <view class="left">
              <text>{{ item.electric }}%</text>
              <view class="left_cover" :style="{width: getLeftWidth(item.electric) + 'rpx', backgroundColor: getLeftBgColor(item.electric)}"></view>
            </view>
            <view class="right">
              <view class="right_cover" :style="{ width: getRightWidth(item.electric) + 'rpx'}"></view>
            </view>
          </view>
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
    httpOpBattery
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
        electric_type_list: [],
        electric_type: '',
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
      onPlacePickOk (obj) {
        this.place_id = obj.place_id
        this.getDataList()
      },
      onEelecPickOk (obj) {
        this.electric_type = obj.value
        this.getDataList()
      },
      getLeftBgColor(number) {
        if (number < 10) {
          return '#e45867'
        } else if (number <= 30) {
          return '#e59a6f'
        } else if (number <= 80) {
          return '#4394f7'
        } else {
          return '#60c166'
        }
      },
      getLeftWidth(electric) {
        if (electric <= 90) {
          return electric
        } else {
          return 90
        }
      },
      getRightWidth(electric) {
        if (electric < 90) {
          return 0
        } else {
          return electric - 90
        }
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
      async getDataList () {
        const params = {
          machine_name: this.searchName,
          province: this.region[0],
          city: this.region[1],
          area: this.region[2],
          electric_type: this.electric_type === -1 ? '' : this.electric_type,
          place_id: this.place_id
        }
        const { msg } = await httpOpBattery(params)
        const obj = {
          value: -1,
          text: '全部'
        }
        this.electric_type_list = msg.electric_type
        this.electric_type_list.unshift(obj)
        this.dataList = msg.battery_info
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

        .electric {
          width: 100rpx;
        }
      }

      .machine_list {

        .list_item {
          padding: 20rpx 15rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #818181;
          font-size: 30rpx;

          .electric {
            display: flex;
            align-items: center;
            justify-content: center;

            .left {
              width: 90rpx;
              height: 38rpx;
              background-color: #ddd;
              border-radius: 4rpx;
              text-align: center;
              color: #FFFFFF;
              position: relative;

              .left_cover {
                width: 50rpx;
                height: 38rpx;
                background-color: #169B45;
                position: absolute;
                top: 0;
                left: 0;
              }

              text {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 999;
              }
            }

            .right {
              position: relative;
              width: 10rpx;
              height: 25rpx;
              background-color: #ddd;

              .right_cover {
                position: absolute;
                top: 0;
                left: 0;
                height: 25rpx;
                background-color: #60c166;
              }
            }
          }
        }
      }
    }

  }
</style>
