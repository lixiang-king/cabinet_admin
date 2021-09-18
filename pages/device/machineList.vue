<template>
  <view class="page_box">
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
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
  </view>

</template>

<script>
  import {
    httpMachineList
  } from '@/utils/request/api/device.js'
  export default {
    data() {
      return {
        dataList: [],
        id: ''
      };
    },
    onLoad(option) {
      const id = option.id
      this.id = id
      if (id) {
        this.getMachineList()
      }
    },
    methods: {
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
      // getWidth(number) {
      // },
      async getMachineList() {
        const params = {
          place_id: this.id
        }
        const { msg } = await httpMachineList(params)
        this.dataList = msg.machine_list
      }
    }
  }
</script>

<style lang="less">
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

          // position: relative;
          // width: 100rpx;
          // height: 38rpx;
          // background-color: #169B45;
          // border-radius: 8rpx;
          // text-align: center;
          // color: #FFFFFF;
          // &::after {
          //   position: absolute;
          //   right: 0;
          //   top: 50%;
          //   transform: translateY(-50%);
          //   width: 20rpx;
          //   height: 20rpx;
          //   background-color: red;
          // }
        }
      }
    }
  }
</style>
