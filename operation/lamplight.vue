<template>
  <view class="lamplight">
    <view class="header"></view>
    <view class="lamplight_info">
      <view class="device_detail">
        <view class="title">
          <text class="p_title">设备状态</text>
        </view>
        <view class="device_info">
          <image :src="require('./static/op_icon_02.png')" mode="widthFix"></image>
          <view class="device_right">
            <view class="device_number">
              <view class="device_item">设备号</view>
              <view class="number_value">
                <input type="text" :value="XDeviceCode" placeholder="扫一扫显示设备号" />
                <image :src="require('./static/op_icon_06.png')" mode="widthFix" @click="scanToShow"></image>
              </view>
            </view>
            <view class="device_status">
              <view class="device_item">设备状态</view>
              <view class="status_value">{{ XCntStatus }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="lamplight_time">
        <view class="title">
          <text class="p_title">灯光时间设置</text>
        </view>
        <view class="lamplight_settings">
          <view class="date_picker_page">
            <view class="value">
              <picker mode="time" :value="start" @change="onStartChange">
                <view class="start_date">{{ start ? start : '开始时间' }}</view>
              </picker>
              <text>—</text>
              <picker mode="time" :value="end" @change="onEndChange">
                <view class="end_date">{{ end ? end : '结束时间' }}</view>
              </picker>
            </view>
          </view>
          <text>请先校准时间，再点击对应选项卡选择灯光关闭时间</text>
          <view class="deviceBinding" @click="onConfirm1">确认设置</view>
        </view>
      </view>
	  
	  <view class="lamplight_time">
	    <view class="title">
	      <text class="p_title">跑马灯灯光时间设置</text>
	    </view>
	    <view class="lamplight_settings">
	      <view class="date_picker_page">
	        <view class="value">
	          <picker mode="time" :value="runStart" @change="onRunStartChange">
	            <view class="start_date">{{ runStart ? runStart : '开始时间' }}</view>
	          </picker>
	          <text>—</text>
	          <picker mode="time" :value="runEnd" @change="onRunEndChange">
	            <view class="end_date">{{ runEnd ? runEnd : '结束时间' }}</view>
	          </picker>
	        </view>
	      </view>
	      <text>请先校准时间，再点击对应选项卡选择灯光关闭时间</text>
	      <view class="deviceBinding" @click="onConfirm2">确认设置</view>
	    </view>
	  </view>
	  
    </view>
  </view>
</template>
<script>
  import BLEC from '@/utils/BLEC/BLEC.js'
  import {
    httpOpLight
  } from '@/utils/request/api/operation.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    computed: {
      ...mapState(['XBLECUrl', 'XDeviceCode',  'XHexData', 'XCntStatus'])
    },
    data() {
      return {
        start: '',
        end: '',
        runStart: '',
        runEnd: ''
      }
    },
    onUnload() {
      BLEC.closeBle()
    },
    onLoad() {
      BLEC.openBluetoothAdapter()
    },
    methods: {
      ...mapMutations(['setDeviceCode', 'setDeviceName']),
      onStartChange(e) {
        this.start = e.target.value
      },
      onEndChange(e) {
        this.end = e.target.value
      },
      onRunStartChange(e) {
        this.runStart = e.target.value
      },
      onRunEndChange(e) {
        this.runEnd = e.target.value
      },
      scanToShow() {
        var that = this
        wx.scanCode({
          success: res =>  {
            const { result } = res
            const arr = result.split('/')
            this.setDeviceCode(arr[arr.length - 1])
            that.setDeviceName(res.result)
            BLEC.startBluetooth();
          }
        })
      },
      onConfirm1() {
        if (!this.start) return uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        if (!this.end) return uni.showToast({
          title: '请选择结束时间',
          icon: 'none'
        })
        BLEC.navTo(1, BLEC.handleTimeFormat(this.start), BLEC.handleTimeFormat(this.end)).then(() => {
          uni.showToast({
            title: '设置成功'
          })
        })
        .catch(() => {
          uni.showToast({
            title: '设置失败',
            icon: 'none'
          })
        })
      },
      onConfirm2() {
        if (!this.runStart) return uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        if (!this.runEnd) return uni.showToast({
          title: '请选择结束时间',
          icon: 'none'
        })
        BLEC.navTo2(170, BLEC.handleTimeFormat(this.runStart), BLEC.handleTimeFormat(this.runEnd)).then(() => {
          uni.showToast({
            title: '设置成功'
          })
        })
        .catch(() => {
          uni.showToast({
            title: '设置失败',
            icon: 'none'
          })
        })
      },
      onConfirm() {
        /* if (!this.start) return uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        if (!this.end) return uni.showToast({
          title: '请选择结束时间',
          icon: 'none'
        })
        const params = {
          code: this.XDeviceCode,
          start: BLEC.handleTimeFormat(this.start),
          end: BLEC.handleTimeFormat(this.end)
        }
        BLEC.handleRequest('/timeSwitch', params)
        .then(res => {
          if (res.code === 200) {
            const hexVal = res.data
            BLEC.write(hexVal)
            .then(() => {
              uni.showToast({
                title: '设置成功'
              })
            })
            .catch(() => {
              uni.showToast({
                title: '设置失败',
                icon: 'none'
              })
            })
          } else {
            uni.showToast({
              title: '设置失败',
              icon: 'none'
            })
          }
        }) */
      }
    }
  }
</script>

<style lang="less" scoped>
  .lamplight {
    position: relative;

    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 162rpx;
      background-color: #FF5449;
    }

    .lamplight_info {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 30rpx;
      left: 50%;
      transform: translateX(-50%);

      .device_detail {
        width: 720rpx;
        height: 315rpx;
        background: #FFFFFF;
        border-radius: 6rpx;
        display: flex;
        flex-direction: column;
        z-index: 2;
        padding: 0 20rpx;
        box-sizing: border-box;

        .device_info {
          display: flex;
          align-items: center;
          margin-top: 20rpx;

          image {
            width: 146rpx;
            margin-left: 20rpx;
          }

          .device_right {
            display: flex;
            flex-direction: column;

            .device_number {
              display: flex;
              align-items: center;
              margin-bottom: 20rpx;

              .number_value {
                display: flex;

                input {
                  width: 260rpx;
                }

                image {
                  width: 40rpx;
                }
              }
            }

            .device_status {
              display: flex;

              .status_value {
                color: #FF544A;
              }
            }
          }
        }
      }
    }
  }

  .device_item {
    width: 120rpx;
    font-size: 30rpx;
    margin: 0 20rpx;
  }

  .title {
    height: 70rpx;
    line-height: 70rpx;
    font-weight: 700;
    border-bottom: 1rpx solid #dddddd;
  }

  .lamplight_time {
    width: 720rpx;
    height: 450rpx;
    background: #FFFFFF;
    border-radius: 5rpx;
    display: flex;
    flex-direction: column;
    padding: 0 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;

    .lamplight_settings {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #999999;

      .date_picker_page {
        height: 70rpx;
        background-color: #FFFFFF;
        display: flex;
        align-items: center;
        font-size: 30rpx;

        .value {
          width: 500rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 25rpx;

          .start_date,
          .end_date {
            padding: 35rpx;
          }
        }
      }

      text {
        font-size: 24rpx;
        margin-top: 35rpx;
        margin-bottom: 35rpx;
      }
    }
  }
  
  .deviceBinding {
    font-size: 30rpx;
    color: #FFFFFF;
    width: 650rpx;
    height: 80rpx;
    background: #FF8D36;
    border-radius: 5px;
    // margin: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50rpx auto;
  }
</style>
