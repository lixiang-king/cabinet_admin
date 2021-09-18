<template>
  <view>
    <SearchHeader placeholder="设备名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="date_picker_page">
      <view class="label">时间选择</view>
      <view class="value">
        <picker mode="date" :value="date" @change="onDateChange">
          <view class="start_date">{{date ? date : '请选择时间'}}</view>
        </picker>
      </view>
    </view>
    <view class="total_line1">
      <view class="line1_item">
        <view class="txt_info">
          <text>{{ sale_info.sum | f_zero }}</text>
          <text>{{ type === '1' ? '今' : '本'}}{{ c_type_name }}订单数</text>
        </view>
        <image src="../../static/img/manage/report_icon_01.png" mode="widthFix"></image>
      </view>
      <view class="line1_item">
        <view class="txt_info">
          <text>{{ sale_info.price | f_zero }}</text>
          <text>{{ type === '1' ? '今' : '本'}}{{ c_type_name }}销售额</text>
        </view>
        <image src="../../static/img/manage/report_icon_02.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="total_line2">
      <view class="line2_item">
        <text>动销</text>
        <text>{{ sale_info.dx | f_zero }}</text>
      </view>
      <view class="line2_item">
        <text>扫码数</text>
        <text>{{ sale_info.scan_code_num | f_zero }}</text>
      </view>
      <view class="line2_item">
        <text>转化率</text>
        <text>{{ sale_info.deal_rate | f_zero }}</text>
      </view>
    </view>
    <!-- 折线图 -->
    <view class="line_charts">
      <view class="p_title">销售占比(%)</view>
      <canvas canvas-id="canvasDaily" id="canvasDaily" class="line" :style="{ height: cHeight + 'px', width: cWidth + 'px' }"
        @touchstart="touchLineDaily"></canvas>
    </view>
    <!-- 销售排行 nav -->
    <view class="sale_rank_title">
      <view class="p_title">销售排行</view>
      <view class="type">
        <view @click="onClickType(1)" :class="['type_item', rankType === 1 ? 'active' : '']">城市</view>
        <view @click="onClickType(2)" :class="['type_item', rankType === 2 ? 'active' : '']">场地</view>
        <view @click="onClickType(3)" :class="['type_item', rankType === 3? 'active' : '']">机器</view>
        <view @click="onClickType(4)" :class="['type_item', rankType === 4 ? 'active' : '']">商品</view>
      </view>
    </view>
    <view class="sale_rank_head">
      <view class="rank_tr">
        <view class="rank_td">排名</view>
        <view class="rank_td">{{ rank_title }}</view>
        <view class="rank_td">销售额</view>
      </view>
    </view>
    <!-- 城市 -->
    <view class="sale_rank_content" v-if="rankType === 1">
      <view class="rank_tr" v-for="(item, index) in city_sales_rank" :key="item.city" @click="onClickRank(1, item)">
        <view class="rank_td">
          <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
          <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
          <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
          <text v-else>{{ index + 1 }}</text>
        </view>
        <view class="rank_td">{{ item.city }}</view>
        <view class="rank_td">¥{{ item.price }}</view>
      </view>
    </view>
    <!-- 场地 -->
    <view class="sale_rank_content" v-if="rankType === 2">
      <view class="rank_tr" v-for="(item, index) in place_sales_rank" :key="item.place_id" @click="onClickRank(2, item)">
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
    <!-- 机器 -->
    <view class="sale_rank_content" v-if="rankType === 3">
      <view class="rank_tr" v-for="(item, index) in machine_sales_rank" :key="item.machineid" @click="onClickRank(3, item)">
        <view class="rank_td">
          <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
          <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
          <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
          <text v-else>{{ index + 1 }}</text>
        </view>
        <view class="rank_td">{{ item.name }}</view>
        <view class="rank_td">¥{{ item.price }}</view>
      </view>
    </view>
    <!-- 商品 -->
    <view class="sale_rank_content" v-if="rankType === 4">
      <view class="rank_tr" v-for="(item, index) in goods_sales_rank" :key="item.pid" @click="onClickRank(4, item)">
        <view class="rank_td">
          <image v-if="index  === 0" src="../../static/img/manage/report_rank_01.png" mode="widthFix"></image>
          <image v-else-if="index  === 1" src="../../static/img/manage/report_rank_02.png" mode="widthFix"></image>
          <image v-else-if="index  === 2" src="../../static/img/manage/report_rank_03.png" mode="widthFix"></image>
          <text v-else>{{ index + 1 }}</text>
        </view>
        <view class="rank_td">{{ item.name }}</view>
        <view class="rank_td">¥{{ item.price }}</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    httpReportDaily,
    httpReportWeekly,
    httpReportMonthly
  } from '@/utils/request/api/report.js'
  import uCharts from '@/components/u-charts/u-charts.js';
  var _self;
  var canvaLineDaily = null;
  export default {
    filters: {
      f_zero: function(value) {
        return value ? value : 0
      }
    },
    computed: {
      rank_title() {
        switch (this.rankType) {
          case 1:
            return '城市名称'
          case 2:
            return '场地名称'
          case 3:
            return '机器名称'
          case 4:
            return '商品名称'
          default:
            return ''
        }
        return this.data
      },
      c_type_name() {
        const obj = {
          '1': '日',
          '2': '周',
          '3': '月'
        }
        return obj[this.type]
      }
    },
    data() {
      return {
        cWidth: '',
        cHeight: '',
        pixelRatio: 1,
        type: '1', // 1日报 2周报 3月报
        date: '',
        searchName: '',
        region: [],
        sale_info: { //销售详情
          price: 0, //今日销售额
          sum: 0, //今日订单数
          dx: 0, //动销
          scan_code_num: 0, //扫码数
          deal_rate: '0' //转化率
        },
        hour_data: [],
        city_sales_rank: [],
        place_sales_rank: [],
        machine_sales_rank: [],
        goods_sales_rank: [],
        rankType: 1 // 1城市 2场地 3机器 4商品
      }
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
      },
      onClickType(type) {
        this.rankType = type
      },
      onClickRank(rankType, record) {
        if (rankType === 1) { // 城市
          uni.navigateTo({
            url: `/pages/report/detail?rankType=${rankType}&type=${this.type}&date=${this.date}&id=${record.city}&title=${record.city}`
          })
        } else if (rankType === 2) { // 场地
          uni.navigateTo({
            url: `/pages/report/detail?rankType=${rankType}&type=${this.type}&date=${this.date}&id=${record.place_id}&title=${record.place}`
          })
        } else if (rankType === 3) { // 机器
          uni.navigateTo({
            url: `/pages/report/detail?rankType=${rankType}&type=${this.type}&date=${this.date}&id=${record.machineid}&title=${record.name}`
          })
        } else { // 商品
          uni.navigateTo({
            url: `/pages/report/detail?rankType=${rankType}&type=${this.type}&date=${this.date}&id=${record.pid}&title=${record.name}`
          })
        }
      },
      onDateChange(e) {
        const res = e.target.value
        this.date = res
        this.getDataList()
      },
      handleDailyData(data) {
        const dataX = []
        const dataY = []
        data.forEach(item => {
          dataX.push(item.hour)
          dataY.push(item.hour_count)
        })
        const series = [{
          name: '时',
          data: dataY,
          color: '#55aca8'
        }]
        const lineDaily = {
          categories: [],
          series: []
        }
        lineDaily.categories = dataX
        lineDaily.series = series
        this.showDailyLine('canvasDaily', lineDaily)
      },
      handleWeeklyData(data) {
        const dataX = []
        const dataY = []
        data.forEach(item => {
          dataX.push(item.time)
          dataY.push(item.price)
        })
        const series = [{
          name: '销售额',
          data: dataY,
          color: '#55aca8'
        }]
        const lineDaily = {
          categories: [],
          series: []
        }
        lineDaily.categories = dataX
        lineDaily.series = series
        this.showDailyLine('canvasDaily', lineDaily)
      },
      handleMonthlyData(data) {
        const dataX = []
        const dataY = []
        data.forEach(item => {
          dataX.push(item.time)
          dataY.push(item.price)
        })
        const series = [{
          name: '销售额',
          data: dataY,
          color: '#55aca8'
        }]
        const lineDaily = {
          categories: [],
          series: []
        }
        lineDaily.categories = dataX
        lineDaily.series = series
        this.showDailyLine('canvasDaily', lineDaily)
      },
      showDailyLine(canvasId, chartData) {
        canvaLineDaily = new uCharts({
          $this: _self,
          canvasId: canvasId,
          type: 'line',
          fontSize: 11,
          legend: {
            show: false
          },
          dataLabel: false,
          dataPointShape: true,
          background: '#FFFFFF',
          pixelRatio: _self.pixelRatio,
          categories: chartData.categories,
          series: chartData.series,
          animation: true,
          xAxis: {
            disabled: true,
            disableGrid: true
            // rotateLabel: true
          },
          yAxis: {
            gridType: 'dash'
            // gridType: 'dash',
            // gridColor: '#CCCCCC',
            // dashLength: 8,
            // splitNumber: 5
            // format: (val) => {
            //   return val + '元'
            // }
          },
          width: _self.cWidth * _self.pixelRatio,
          height: _self.cHeight * _self.pixelRatio
          // extra: {
          //   line: {
          //     type: 'straight'
          //   }
          // },
        });

      },
      async getdailyData() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : '',
          date: this.date
        }
        const {
          msg
        } = await httpReportDaily(params)
        this.sale_info = msg.sale_info
        this.handleDailyData(msg.hour_data)
        this.city_sales_rank = msg.city_sales_rank
        this.place_sales_rank = msg.place_sales_rank
        this.machine_sales_rank = msg.machine_sales_rank
        this.goods_sales_rank = msg.goods_sales_rank
      },
      async getWeeklyData() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : '',
          date: this.date
        }
        const {
          msg
        } = await httpReportWeekly(params)
        this.sale_info = msg.sale_info
        this.handleWeeklyData(msg.week_data)
        this.city_sales_rank = msg.city_sales_rank
        this.place_sales_rank = msg.place_sales_rank
        this.machine_sales_rank = msg.machine_sales_rank
        this.goods_sales_rank = msg.goods_sales_rank
      },
      async getMonthlyData() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : '',
          date: this.date
        }
        const {
          msg
        } = await httpReportMonthly(params)
        this.sale_info = msg.sale_info
        this.handleMonthlyData(msg.month_data)
        this.city_sales_rank = msg.city_sales_rank
        this.place_sales_rank = msg.place_sales_rank
        this.machine_sales_rank = msg.machine_sales_rank
        this.goods_sales_rank = msg.goods_sales_rank
      },
      getDataList() {
        if (this.type === '1') { // 日报
          this.getdailyData()
        } else if (this.type === '2') { // 周
          this.getWeeklyData()
        } else { // 月报
          this.getMonthlyData()
        }
      },
      touchLineDaily(e) {
        canvaLineDaily.showToolTip(e, {
          format: function(item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        });
      }
    },
    onLoad(option) {
      _self = this;
      this.cWidth = uni.upx2px(700);
      this.cHeight = uni.upx2px(500);
      const type = option.type
      this.type = type
      if (type === '1') {
        uni.setNavigationBarTitle({
          title: '运营日报'
        })
      } else if (type === '2') {
        uni.setNavigationBarTitle({
          title: '运营周报'
        })
      } else {
        uni.setNavigationBarTitle({
          title: '运营月报'
        })
      }
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .date_picker_page {
    padding: 0 30rpx;
    height: 70rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    color: #bcbcbc;
    font-size: 30rpx;

    .label {
      width: 120rpx;
      margin-right: 36rpx;
      color: #595959;
    }

    .value {
      width: 500rpx;
      display: flex;
      align-items: center;

      // justify-content: center;
      .spliter {
        margin: 0 50rpx;
      }
    }

  }

  .total_line1 {
    // padding: 8rpx;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    color: #FFFFFF;
    margin-top: 12rpx;

    .line1_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;
      width: 362rpx;
      height: 110rpx;
      border-radius: 5rpx;
      padding: 0 27rpx;
      box-sizing: border-box;
      background-color: #FFFFFF;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
      background: url(../../static/img/manage/report_bg_l.png) no-repeat;
      background-size: contain;

      &:nth-of-type(1) {
        margin-right: 8rpx;
      }

      .txt_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;

        text {
          font-size: 24rpx;

          &:nth-of-type(1) {
            font-size: 30rpx;
            opacity: 0.85;
          }
        }
      }

      image {
        width: 76rpx;
        margin-left: 24rpx;
      }
    }
  }

  .total_line2 {
    display: flex;
    justify-content: space-between;
    padding: 0 12rpx;

    .line2_item {
      width: 240rpx;
      height: 82rpx;
      line-height: 82rpx;
      vertical-align: baseline;
      background: url(../../static/img/manage/report_bg_s.png) no-repeat;
      background-size: contain;
      color: #FFFFFF;
      text-align: center;

      &:nth-of-type(2) {
        margin: 0 8rpx;
      }

      text {
        &:nth-of-type(1) {
          font-size: 24rpx;
          opacity: 0.85;
          margin-right: 8rpx;
        }

        &:nth-of-type(2) {
          font-size: 40rpx;
          opacity: 0.85;
        }
      }
    }

  }

  .line_charts {
    margin: 12rpx 8rpx;
    padding: 10rpx;
    background-color: #FFFFFF;
  }

  .sale_rank_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20rpx;
    margin: 0 10rpx;
    height: 88rpx;
    background-color: #FFFFFF;

    .type {
      display: flex;
      font-size: 24rpx;
      color: #9B9B9B;

      .type_item {
        background-color: #DEDEDE;
        padding: 5rpx 20rpx;
        height: 40rpx;
        line-height: 40rpx;

        &.active {
          background-color: #FF5449;
          color: #FFFFFF;
        }

        &:nth-of-type(1) {
          border-radius: 10rpx 0 0 10rpx;
        }

        &:nth-of-type(4) {
          border-radius: 0 10rpx 10rpx 0;
        }
      }
    }
  }

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

  .sale_rank_head {
    height: 47rpx;
    line-height: 47rpx;
  }

  .sale_rank_content {
    background-color: #FFFFFF;

    .rank_tr {
      border-bottom: 1rpx solid #f2f2f2;
      height: 68rpx;
      line-height: 68rpx;
      color: #000000;
      opacity: 0.84;

      .rank_td {
        &:nth-of-type(3) {
          color: #FF544A;
        }
      }

      // background-color: green;
    }

    image {
      width: 55rpx;
      height: 50rpx;
    }
  }
</style>
