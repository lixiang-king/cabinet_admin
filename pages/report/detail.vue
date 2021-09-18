<template>
  <view class="detail_page">
    <view class="info">
      <view class="title">
        {{ title }}
      </view>
      <view class="date">
        <picker mode="date" :value="date" @change="onDateChange">
          <view class="start_date">
            <image src="../../static/img/manage/report_date.png" mode="widthFix"></image>
          {{ dateTitle }}
         </view>
        </picker>
      </view>
    </view>
    <!-- <image class="bg_img" src="../../static/img/manage/report_bg.png" mode="widthFix"></image> -->
    <view class="rank_list">
      <view class="sale_rank_content" v-if="rankType === 1">
        <view class="rank_tr rank_tr_head">
          <view class="rank_td">排名</view>
          <view class="rank_td">场地名称</view>
          <view class="rank_td">销售额</view>
        </view>
        <view class="rank_tr" v-for="(item, index) in city_place_info" :key="index" @click="onClickDetail(1, item)">
          <view class="rank_td">
            <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
            <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
            <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="rank_td">{{ item.place }}</view>
          <view class="rank_td">¥{{ item.price }}</view>
        </view>
      </view>
      <view class="sale_rank_content" v-if="rankType === 2">
        <view class="rank_tr rank_tr_head">
          <view class="rank_td">排名</view>
          <view class="rank_td">设备名称</view>
          <view class="rank_td">销售额</view>
        </view>
        <view class="rank_tr" v-for="(item, index) in place_machine_info" :key="index" @click="onClickDetail(2, item)">
          <view class="rank_td">
            <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
            <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
            <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="rank_td">{{ item.machine_name }}</view>
          <view class="rank_td">¥{{ item.price }}</view>
        </view>
      </view>
      <view class="sale_rank_content" v-if="rankType === 3">
        <view class="rank_tr rank_tr_head">
          <view class="rank_td">排名</view>
          <view class="rank_td">商品名称</view>
          <view class="rank_td">销售额</view>
        </view>
        <view class="rank_tr" v-for="(item, index) in machine_goods_info" :key="index" @click="onClickDetail(3, item)">
          <view class="rank_td">
            <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
            <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
            <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="rank_td">{{ item.goods_name }}</view>
          <view class="rank_td">¥{{ item.price }}</view>
        </view>
      </view>
      <view class="sale_rank_content" v-if="rankType === 4">
        <view class="rank_tr rank_tr_head">
          <view class="rank_td">排名</view>
          <view class="rank_td">场地名称</view>
          <view class="rank_td">销售额</view>
        </view>
        <view class="rank_tr" v-for="(item, index) in goods_machine_info" :key="index" @click="onClickDetail(4, item)">
          <view class="rank_td">
            <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
            <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
            <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
            <text v-else>{{ index + 1 }}</text>
          </view>
          <view class="rank_td">{{ item.machine_name }}</view>
          <view class="rank_td">¥{{ item.price }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    httpMachine4Goods,
    httpGoods4Machine,
    httpCity4Place,
    httpPlace4Machine
  } from '@/utils/request/api/report.js'
  export default {
    computed: {
      dateTitle () {
        if (this.date) {
          return this.date
        } else {
          return '选择时间'
        }
      }
    },
    data() {
      return {
        type: '1',
        rankType: 1,
        date: '',
        id: '',
        title: '',
        city_place_info: [],
        place_machine_info: [],
        machine_goods_info: [],
        goods_machine_info: []
      }
    },
    methods: {
      onDateChange (e) {
        const res = e.target.value
        this.date = res
        this.getDataList()
      },
      onClickDetail (type, item) {
        if (type === 1) { // 城市 -> 场地 --> 设备
          this.rankType = 2
          this.id = item.place_id
          this.title = item.place
          this.getDataList()
        }
        // else if (type === 2) {  // 场地 -> 设备
        // } else if (type === 3) {  // 机器 --> 商品 --> 机器销售
        //   // this.rankType = 4
        //   // this.id = item.pid
        //   // this.title = item.goods_name
        //   // this.getDataList()
        // } else if (type === 4) {  // 商品 --> 机器销售
        // } else {
        // }
      },
      async getCity4Place(){
        const params = {
          city: this.id,
          date: this.date,
          type: this.type
        }
        const { msg } = await httpCity4Place(params)
        this.city_place_info = msg.city_place_info
      },
      async getPlace4Machine() {
        const params = {
          place_id: this.id,
          date: this.date,
          type: this.type
        }
        const { msg } = await httpPlace4Machine(params)
        this.place_machine_info = msg.place_machine_info
      },
      async getMachine4Goods(){
        const params = {
          machineid: this.id,
          date: this.date,
          type: this.type
        }
        const { msg } = await httpMachine4Goods(params)
        this.machine_goods_info = msg.goods_sale_info
      },
      async getGoods4Machine(){
        const params = {
          pid: this.id,
          date: this.date,
          type: this.type
        }
        const { msg } = await httpGoods4Machine(params)
        this.goods_machine_info = msg.machine_sale_info
      },
      getDataList () {
        if (this.rankType === 1) { // city --> 场地名
          this.getCity4Place()
        } else if (this.rankType === 2) { // 场地 --> 设备信息
          this.getPlace4Machine()
        } else if (this.rankType === 3) { // 机器 --> 商品销售
          this.getMachine4Goods()
        } else if (this.rankType === 4) { // 商品 --> 机器销售
          this.getGoods4Machine()
        }
      }
    },
    onLoad(option) {
      this.type = option.type
      this.rankType = Number(option.rankType)
      this.date = option.date
      this.id = option.id
      this.title = option.title
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .detail_page {
    position: relative;
    height: 500rpx;
    background: url(../../static/img/manage/report_bg.png) no-repeat top center;
    background-size: 100% auto;
    padding-top: 240rpx;

    .info {
      position: absolute;
      top: 80rpx;
      left: 50rpx;

      .title {
        color: #FFFFFF;
      }
      .date {
        color: #FFFFFF;
      }
    }
  }
  .start_date {
    display: flex;
    align-items: center;
    image {
      width: 40rpx;
    }
  }
  .rank_list {
    margin: 0 10rpx;
    background-color: #fff;
    // display: none;
    border-radius: 5rpx;

    .rank_tr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20rpx;
      margin: 0 10rpx;
      font-size: 30rpx;

      .rank_td {
        display: flex;

        &:nth-of-type(1) {
          width: 180rpx;
          // background-color: #4CD964;
        }

        &:nth-of-type(2) {
          width: 350rpx;
          // display: flex;
          // justify-content: flex-start;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // background-color: #007AFF;
        }

        &:nth-of-type(3) {
          width: 180rpx;
          display: flex;
          justify-content: flex-end;
          // background-color: #DD524D;
        }
      }
    }

    .sale_rank_content {
      background-color: #FFFFFF;

      .rank_tr {
        border-bottom: 1rpx solid #f2f2f2;
        height: 68rpx;
        line-height: 68rpx;
        color: #5b5b5b;

        .rank_td {
          &:nth-of-type(3) {
            color: #FF544A;
          }
        }
      }

      .rank_tr_head {
        color: #333333;

        .rank_td {
          &:nth-of-type(3) {
            color: #333333;
          }
        }
      }

      image {
        width: 55rpx;
        height: 50rpx;
      }
    }
  }
</style>
