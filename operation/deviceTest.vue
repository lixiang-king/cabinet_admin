<template>
  <view class="deviceTest">
    <view class="header"></view>
    <view class="device_test">
      <view class="deviceTest1">
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
      <view class="deviceTest2">
        <view class="title">
          <text class="p_title">测试</text>
        </view>
        <view class="test_info">
          <view class="test_number" v-for="item in 9" :key="item" @click="onSetNumber(item)">{{ item + 1}}</view>
        </view>
        <view class="light_btn">
          <view class="open_light" @click="openLight">
            <image :src="require('./static/open_light.png')" mode="widthFix"></image>
            <text>开灯</text>
          </view>

          <view class="close_light" @click="closeLight">
            <image :src="require('./static/close_light.png')" mode="widthFix"></image>
            <text>关灯</text>
          </view>
        </view>
        <view class="battery_btn">电量: {{ XBattery ? XBattery : 0 }}</view>
      </view>
    </view>
  </view>
</template>
<script>
  import BLEC from '@/utils/BLEC/BLEC.js'
  import {
    httpOpDeviceTest
  } from '@/utils/request/api/operation.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    computed: {
      ...mapState(['XDeviceCode',  'XHexData', 'XBattery', 'XCntStatus'])
    },
    data() {
      return {
        battery: 0
      }
    },
    onUnload() {
      BLEC.closeBle()
    },
    onLoad() {
      BLEC.openBluetoothAdapter()
    },
    methods: {
      ...mapMutations(['setDeviceCode']),
      scanToShow() {
        uni.scanCode({
          success: res => {
            const { result } = res
            const arr = result.split('/')
            this.setDeviceCode(arr[arr.length - 1])
            // https://me.dc-box.com/scode/A20081001022
            BLEC.found()
          }
        })
      },
      onSetNumber(index) {
        const params = {
          machine_id: this.XDeviceCode,
          hid: index + 1
        }
        httpOpDeviceTest(params).then(res => {
          if (res.code === 1) {
            const hex = this.XHexData.changeHex[index]
            BLEC.write(hex).then(res => {
              console.log(92)
            })
          } else {
            uni.showToast({
              title: '暂无权限',
              icon: 'none'
            })
          }
        })
        .catch(r => {
          uni.showToast({
            title: '获取权限失败',
            icon: 'none'
          })
        })
      },
      openLight() {
        BLEC.write(this.XHexData.toggleLight.open)
      },
      closeLight() {
        BLEC.write(this.XHexData.toggleLight.close)
      }
    }
  }
</script>

<style lang="less" scoped>
  .deviceTest {
    position: relative;

    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 162rpx;
      background-color: #FF5449;
    }

    .device_test {
      display: flex;
      flex-direction: column;
      align-items: center;

      .deviceTest1 {
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

      .deviceTest2 {
        width: 720rpx;
        // height: 770rpx;
        background: #FFFFFF;
        border-radius: 5rpx;
        margin-top: 20rpx;
        padding: 0 20rpx;
        box-sizing: border-box;

        .test_info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 50rpx;
          margin-left: 80rpx;

          .test_number {
            width: 110rpx;
            height: 110rpx;
            background: #FF544A;
            border-radius: 8rpx;
            margin-right: 80rpx;
            margin-bottom: 60rpx;
            line-height: 110rpx;
            text-align: center;
            color: #FFFFFF;
            font-size: 60rpx;
          }
        }

        .light_btn {
          display: flex;
          justify-content: center;
          color: #FFFFFF;

          .open_light,
          .close_light {
            width: 215rpx;
            height: 80rpx;
            border-radius: 5rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            image {
              width: 31rpx;
              margin-right: 10rpx;
            }
          }

          .open_light {
            background: #FF544A;
            margin-right: 90rpx;
          }

          .close_light {
            background: #FF8D36;
          }
        }
        
        .battery_btn {
          margin: 30rpx 0;
          margin-left: 80rpx;
          width: 520rpx;
          height: 80rpx;
          line-height: 70rpx;
          text-align: center;
          border-radius: 6rpx;
          background: linear-gradient(to right, #ec6053 0%,#f0924b 100%);
          color: #FFFFFF;
        }
      }
    }
  }

  .title {
    height: 70rpx;
    line-height: 70rpx;
    font-weight: 700;
    border-bottom: 1rpx solid #dddddd;
  }

  .device_item {
    width: 120rpx;
    font-size: 30rpx;
    margin: 0 20rpx;
  }
</style>
