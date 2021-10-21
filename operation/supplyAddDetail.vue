<template>
  <view class="detail_page">
    <view class="search_block">
      <view class="search_input">
        <image src="../static/img/public/search.png" mode="widthFix"></image>
        <input type="text" confirm-type="search" :value="goodsName" placeholder="请输入设备信息" @input="onSearchInput" />
      </view>
      <text class="search" @click="toSearch">搜索</text>
    </view>
    <view class="scan" @click="toOperation">
      <image src="./static/op_scan.png" mode="widthFix"></image>
      <text>扫码补货</text>
    </view>
    <view class="goods_box">
      <view class="p_title box_title">缺货商品</view>
      <view class="list_item" v-for="item in goods_info" :key="item.goods_name">
        <image :src="item.small_img" mode="widthFix"></image>
        <view class="item_info">
          <view class="item_name">{{ item.goods_name }}</view>
          <view>
            缺货总数：<text class="num">{{ item.need_buhuo_num }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="table_title">
      <view>设备名称</view>
      <view>缺货格子</view>
    </view>
    <view class="device_box">
      <view class="device_table">
        <view class="table_list" v-for="item in machine_info" :key="item.machine_id">
          <view class="tr">
            <view class="p_title">{{ item.machine_name }}</view>
            <view class="square_box">
              <view v-for="jtem in item.hdList" :key="jtem" class="square">
                {{ jtem }}
              </view>
            </view>
          </view>
          <view class="square_list">
            <view class="list_item" v-for="jtem in item.hd_info" :key="jtem.hid">
              <image :src="jtem.small_img" mode=""></image>
              <view class="item_info">
                <view class="info_title">{{ jtem.goods_name }}</view>
                <view class="info_square">
                  格子号：<view>{{ jtem.hid }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    httpOpReplenishDetail
  } from '@/utils/request/api/operation.js'
  export default {
    data() {
      return {
        id: '',
        goodsName: '',
        goods_info: [],
        machine_info: []
      }
    },
    methods: {
      onSearchInput(e) {
        this.goodsName = e.target.value
      },
      toSearch() {

      },
      toOperation() {
        uni.scanCode({
          success: res => {
            const {
              result
            } = res
            // https://me.dc-box.com/scode/A20081001022
            /* const deviceNum = result.slice(result.length - 12, result.length)
            // this.deviceCode = deviceNum
            uni.navigateTo({
              // url: '/operation/supplyAddOp?deviceCode=' + deviceNum + '&machineId=' + this.id
              url: '/operation/supplyAddOp?deviceCode=' + deviceNum + '&machineId=' + '2019102252000036'
            }) */
            uni.navigateTo({
              // url: '/operation/supplyAddOp?deviceCode=' + deviceNum + '&machineId=' + this.id
              url: '/operation/supplyAddOp?deviceCode=' + result
            })
          }
        })
      },
      handleHd(machine_info) {
        machine_info.forEach(item => {
          const hdArr = []
          item.hd_info.forEach(jtem => {
            hdArr.push(jtem.hid)
          })
          item.hdList = hdArr
        })
        this.machine_info = machine_info
      },
      async getDataList() {
        const params = {
          place_id: this.id
        }
        const { msg } = await httpOpReplenishDetail(params)
        this.handleHd(msg.qh_machine_info)
        this.goods_info = msg.qh_goods_info
      }
    },
    onLoad(option) {
      this.id = option.id
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .detail_page {
    .search_block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      padding: 16rpx 20rpx;

      .search_input {
        position: relative;
        display: flex;
        justify-content: enter;
        align-items: center;

        image {
          width: 25rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 15rpx;
        }

        input {
          width: 600rpx;
          height: 50rpx;
          background-color: #EBEBEB;
          border-radius: 10rpx;
          font-size: 24rpx;
          padding-left: 50rpx;
        }
      }

      .search {
        font-size: 28rpx;
        width: 57rpx;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
      }
    }

    .scan {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 346rpx;
      margin: 15rpx;
      background-color: #FFFFFF;
      margin-top: 10rpx;
      border-radius: 6rpx;

      image {
        width: 278rpx;
      }
    }

    .goods_box {
      margin: 15rpx;
      margin-top: 15rpx;
      padding: 15rpx;
      background-color: #FFFFFF;
      border-radius: 6rpx;

      .box_title {
        border-bottom: 1rpx solid #dddddd;
        height: 70rpx;
        line-height: 70rpx;
      }

      .list_item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #dddddd;

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
      }
    }

    .table_title {
      background-color: #FFFFFF;
      display: flex;
      // margin: 15rpx;
      padding: 10rpx;
      font-weight: bold;
      text-align: center;
      border-bottom: 1rpx solid #EEEEEE;

      view {
        &:nth-of-type(1) {
          width: 350rpx;
          text-align: left;
        }

        &:nth-of-type(2) {
          width: 350rpx;
          text-align: right;
        }
      }
    }

    .device_box {
      border-radius: 6rpx;

      .device_table {
        border-radius: 6rpx;

        .tr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #FFFFFF;
          padding: 10rpx;

          view {

            // width: 200rpx;
            &:nth-of-type(1) {
              width: 350rpx;
            }

            &:nth-of-type(2) {
              width: 350rpx;
              display: flex;
              justify-content: flex-end;
            }
          }
        }

        .table_head {
          font-weight: bold;
          border-bottom: 1rpx solid #EEEEEE;
          padding-bottom: 10rpx;
        }
      }

      .device_list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .list_item {
          width: 300rpx;
          display: flex;
          align-items: center;
          padding: 20rpx;

          image {
            width: 83rpx;
            margin-right: 20rpx;
          }

          .item_info {
            font-size: 24rpx;

            .item_name {
              font-weight: bold;
            }
          }
        }
      }

      .square_list {
        // margin: 20rpx 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 15rpx;

        .list_item {
          width: 360rpx;
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;

          image {
            width: 83rpx;
            min-width: 83rpx;
            height: 83rpx;
            margin-right: 10rpx;
          }

          .item_info {
            font-size: 24rpx;

            .info_title {
              font-weight: 600;
              margin-bottom: 10rpx;
            }

            .info_square {
              display: flex;
              align-items: center;
              color: #333333;

              view {
                width: 30rpx;
                height: 30rpx;
                line-height: 30rpx;
                background-color: #FF8D35;
                border-radius: 5rpx;
                color: #FFFFFF;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }

  .square_box {
    display: flex;
    align-items: center;

    .square {
      width: 30rpx;
      min-width: 30rpx;
      max-width: 30rpx;
      height: 30rpx;
      line-height: 30rpx;
      text-align: center;
      background-color: #ec6052;
      border-radius: 5rpx;
      color: #FFFFFF;
      margin-right: 10rpx;
      font-size: 24rpx;
    }
  }
</style>
