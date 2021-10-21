<template>
  <view class="add_page">
    <view class="header"></view>
    <view class="edit_form">
      <view class="p_title form_title">设备号：{{ XDeviceCode }}</view>
      <view class="goods_box">
        <view class="list_item" v-for="(item, index) in dataList" :key="item.hid">
          <image :src="item.small_img" mode="widthFix"></image>
          <view class="item_info">
            <view class="item_name">{{ item.goods_name }}</view>
            <view class="square_box">
              <view>对应格子：</view>
              <view class="square">{{ item.hid}}</view>
            </view>
          </view>
          <view class="btn out_btn" @click="onStockOut(item)">出仓</view>
          <view class="btn confirm_btn" @click="onConfirm(item)">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import BLEC from '@/utils/BLEC/BLEC.js'
  import {
    httpOpReplenishOpList,
    httpOpReplenishOpConfirm
  } from '@/utils/request/api/operation.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    computed: {
      ...mapState(['XDeviceCode', 'XHexData'])
    },
    data() {
      return {
        dataList: []
      }
    },
    methods: {
      ...mapMutations(['setDeviceCode', 'setDeviceName']),
      onStockOut (item) {
        const index = Number(item.hid) - 1
        BLEC.navTo1(index).then(res => {
          uni.showToast({
            title: '出仓成功'
          })
        })
        .catch(r => {
          uni.showToast({
            title: '出仓失败',
            icon: 'none'
          })
        })
        /* BLEC.write(this.XHexData.fillHex[index])
        .then(res => {
          uni.showToast({
            title: '出仓成功'
          })
        })
        .catch(r => {
          uni.showToast({
            title: '出仓失败',
            icon: 'none'
          })
        }) */
      },
      onConfirm(item) {
        const params = {
          machine_id: item.machineid,
          hid: item.hid,
          pid: item.pid,
          bh_num: 1
        }
        httpOpReplenishOpConfirm(params)
        .then(res => {
          uni.showToast({
            title: '确认成功'
          })
          this.getDataList()
        })
        .catch(r => {
          uni.showToast({
            title: '确认失败',
            icon: 'none'
          })
        })
      },
      async getDataList() {
        const params = {
          machine_id: this.XDeviceCode
        }
        const { msg } = await httpOpReplenishOpList(params)
        this.dataList = msg.machine_qh_info
      }
    },
    async onLoad(option) {
      // await BLEC.openBluetoothAdapter()
      this.machine_id = option.machineId
      this.setDeviceCode(option.deviceCode)
      console.log("=======onload===");
      console.log(option.deviceCode);
      this.setDeviceName(option.deviceCode)
      await this.getDataList()
      // await BLEC.found()
      await BLEC.startBluetooth();
    },
    onUnload() {
      BLEC.closeBle()
    }
  }
</script>

<style lang="less" scoped>
  .add_page {
    position: relative;

    .header {
      position: absolute;
      top: -10rpx;
      left: 0;
      width: 100%;
      height: 162rpx;
      background-color: #ff5449;
      // z-index: 1;
    }

    .edit_form {
      padding: 10rpx;
      position: absolute;
      top: 30rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 710rpx;
      z-index: 2;
      background-color: #ffffff;

      .form_title {
        font-weight: bold;
        // margin-bottom: 10rpx;
        border-bottom: 1rpx solid #EEEEEE;
        height: 70rpx;
        line-height: 70rpx;
      }

      .form_item {
        height: 64rpx;
        display: flex;
        align-items: center;
        padding: 0 15rpx;
        border-bottom: 1rpx solid #b5b5b5;

        .label {
          width: 160rpx;
          text-align: left;
          font-size: 30rpx;
          margin-right: 60rpx;
          color: rgba(0, 0, 0, 0.8);

          .label_icon {
            position: relative;

            &:after {
              content: "*";
              position: absolute;
              right: -20rpx;
              top: -10rpx;
              color: #e04050;
            }
          }
        }

        .value {
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }

  .goods_box {
    margin: 15rpx;
    margin-top: 15rpx;
    padding: 10rpx;
    background-color: #FFFFFF;
    border-radius: 6rpx;

    .list_item {
      display: flex;
      align-items: center;
      padding: 15rpx;
      border-bottom: 1rpx solid #dddddd;

      &:nth-last-of-type(1) {
        border: none
      }

      image {
        width: 120rpx;
        margin-right: 25rpx;
      }

      .item_info {
        .item_name {
          font-weight: bold;
        }

        .num {
          color: #E44654;
        }
      }

      .btn {
        width: 74rpx;
        height: 74rpx;
        line-height: 74rpx;
        text-align: center;
        border-radius: 100%;
        color: #FFFFFF;
        margin-right: 20rpx;
        font-size: 24rpx;
      }

      .out_btn {
        background-color: #FF544A;
      }

      .confirm_btn {
        background-color: #FF8D36;
      }
    }
  }

  .square_box {
    display: flex;
    align-items: center;
    width: 300rpx;

    .square {
      width: 28rpx;
      max-width: 28rpx;
      height: 28rpx;
      line-height: 28rpx;
      text-align: center;
      background-color: #FF8E36;
      border-radius: 5rpx;
      color: #FFFFFF;
      margin-right: 10rpx;
      font-size: 24rpx;
    }
  }
</style>
