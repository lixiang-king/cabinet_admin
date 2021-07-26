<template>
  <view>
    <SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="list_box">
      <view class="list_title">
        <view class="p_title">缺货机器</view>
        <view class="options">
          已选<text class="c_ac_color">{{ idsLen }}</text>台/共{{ pageTotal }}台
          <view class="btn" @click="onSelectedAll">
            {{ isAll ? '全不选' : '全选' }}
          </view>
        </view>
      </view>
      <scroll-view class="list" v-if="machineList.length" scroll-y="true" @scrolltolower="onScrollLower">
          <view class="list_item" v-for="item in dataList" :key="item.machine_id" @click="onSelect(item.machine_id)">
            <image :src="require('./static/op_icon.png')" mode="widthFix"></image>
            <view class="info">
              <text>{{ item.machine_name }}</text>
              <text>机器编号：{{ item.machine_id }}</text>
            </view>
            <view :class="['op', handleIsSelect(item.machine_id) ? 'active' : '']">✓️</view>
          </view>
      </scroll-view>
      <view class="c_empty_box" v-else>
        <image src="../static/img/public/empty.png" mode="widthFix"></image>
        暂无内容
      </view>
    </view>
    <view class="bottom_btn" @click="toSta">
      一键统计
    </view>
  </view>
</template>

<script>
  import {
    httpOpStockoutDeviceSta
  } from '@/utils/request/api/operation.js'
  export default {
    computed: {
      idsLen() {
        return this.idList.length
      },
      isAll() {
        if (this.idList.length === this.machineList.length) {
          return true
        } else {
          return false
        }
      }
    },
    data() {
      return {
        dataList: [],
        region: [],
        searchName: '',
        idList: [],
        machineList: [],
        pageSize: 10,
        pageNumber: 1,
        pageTotal: 0
      };
    },
    methods: {
      onSelectedAll() {
        if (this.isAll) {
          this.idList = []
        } else {
          const res = this.machineList.map(item => {
            return item.machine_id
          })
          this.idList = res
        }
      },
      onSelect(id) {
        // 判断是否已选择
        const res = this.idList.find(item => {
          return item === id
        })
        if (!res) {
          this.idList.push(id)
        } else {
          const idx = this.idList.indexOf(id)
          this.idList.splice(idx, 1)
        }
      },
      handleIsSelect(id) {
        const item = this.idList.find(item => {
          return item === id
        })
        if (item) {
          return true
        } else {
          return false
        }
      },
      onSelectRegion(region) {
        this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
      },
      toSta() {
        uni.navigateTo({
          url: '/operation/supplyShortStatistic?ids=' + encodeURIComponent(JSON.stringify(this.idList.join(',')))
        })
      },
      onScrollLower () {
        if (this.dataList.length >= this.pageTotal) return
        this.pageNumber++
        this.handlePageData()
      },
      handlePageData () {
        const idxStart =(this.pageNumber - 1) * this.pageSize
        const idxEnd = this.pageNumber * this.pageSize
        this.dataList.push(...this.machineList.slice(idxStart, idxEnd))
      },
      async getDataList() {
        this.pageNumber = 1
        this.dataList = []
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpOpStockoutDeviceSta(params)
        this.machineList = msg.shortage_machine
        // this.pageTotal = msg.shortage_machine_sum
        this.pageTotal = msg.shortage_machine.length
        this.handlePageData()
      }
    },
    onLoad() {
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .list_box {
    margin: 10rpx;
    padding: 0 15rpx;
    background-color: #FFFFFF;
    margin-bottom: 100rpx;

    .list_title {
      height: 70rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      border-bottom: 1rpx solid #dddddd;

      .options {
        display: flex;

        .btn {
          background-color: #FF5349;
          color: #FFFFFF;
          width: 100rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          margin-left: 36rpx;
          border-radius: 5rpx;
        }
      }
    }

    .list {
      // height: 100%;
      height: calc(100vh - 100rpx);
      .list_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 15rpx;
        border-bottom: 1rpx solid #dddddd;

        &:nth-last-of-type(1) {
          border: none;
        }

        image {
          width: 80rpx;
          height: 104rpx;
          margin-right: 30rpx;
        }

        .info {
          width: 540rpx;
          display: flex;
          flex-direction: column;
          align-items: left;

          text {
            &:nth-of-type(1) {
              font-weight: bold;
            }

            &:nth-of-type(2) {
              color: #333333;
              font-size: 24rpx;
            }
          }
        }

        .op {
          width: 38rpx;
          height: 38rpx;
          line-height: 38rpx;
          text-align: center;
          border: 1rpx solid #bbbbbb;
          color: #bbbbbb;
          border-radius: 50%;

          &.active {
            color: #FF5349;
            border-color: #FF5349;
          }
        }
      }
    }
  }
</style>
