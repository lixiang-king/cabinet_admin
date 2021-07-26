<template>
  <view class="page_box">
    <view class="static_page" v-if="hasRoot">
      <SearchHeader placeholder="设备名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
      <view class="total_box">
        <view class="time_nav">
          <view :class="[activeTimeNav === 1 ? 'active' : '']" @click="onTimeChange(1)">今日</view>
          <view :class="[activeTimeNav === 2 ? 'active' : '']" @click="onTimeChange(2)">本周</view>
          <view :class="[activeTimeNav === 3 ? 'active' : '']" @click="onTimeChange(3)">本月</view>
          <view :class="[activeTimeNav === 4 ? 'active' : '']" @click="onTimeChange(4)">总量</view>
        </view>
        <view class="totalize">
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ machine_sum }}</text>
              <text>设备总量</text>
            </view>
            <image src="../../static/img/statistics/total_01.png" mode="widthFix"></image>
          </view>
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ totalInfo.price }}</text>
              <text>销售金额总计</text>
            </view>
            <image src="../../static/img/statistics/total_02.png" mode="widthFix"></image>
          </view>
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ totalInfo.sum }}</text>
              <text>订单总数</text>
            </view>
            <image src="../../static/img/statistics/total_03.png" mode="widthFix"></image>
          </view>
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ totalInfo.dx }}</text>
              <text>动销</text>
            </view>
            <image src="../../static/img/statistics/total_04.png" mode="widthFix"></image>
          </view>
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ totalInfo.scan_code_num }}</text>
              <text>扫码次数</text>
            </view>
            <image src="../../static/img/statistics/total_05.png" mode="widthFix"></image>
          </view>
          <view class="total_item">
            <view class="txt">
              <text class="number">{{ totalInfo.deal_rate }}</text>
              <text>成交率</text>
            </view>
            <image src="../../static/img/statistics/total_06.png" mode="widthFix"></image>
          </view>
        </view>
      </view>
    
      <view class="charts_box">
        <view class="p_title">
          点位分布统计
        </view>
        <canvas canvas-id="pos_map" id="pos_map" class="charts" style="height: 800rpx;" @touchstart="touchMap"></canvas>
      </view>
      <view class="charts_box">
        <view class="charts_title">
          <view class="p_title">
            销售额数据分析
          </view>
          <view class="option">
            <view :class="[saleMoneyNav === 1 ? 'active' : '']" @click="onSaleMoneyNav(1)">近一周</view>
            <view :class="[saleMoneyNav === 2 ? 'active' : '']" @click="onSaleMoneyNav(2)">近半年</view>
          </view>
        </view>
        <canvas canvas-id="sales_money_bar" id="sales_money_bar" class="charts" style="height: 400rpx;" @touchstart="touchSaleMount"></canvas>
      </view>
      <view class="charts_box">
        <view class="charts_title">
          <view class="p_title">
            销售量数据分析
          </view>
          <view class="option">
            <view :class="[saleSumNav === 1 ? 'active' : '']" @click="onSaleSumNav(1)">近一周</view>
            <view :class="[saleSumNav === 2 ? 'active' : '']" @click="onSaleSumNav(2)">近半年</view>
          </view>
        </view>
        <canvas canvas-id="sales_sum_bar" id="sales_sum_bar" class="charts" style="height: 400rpx;" @touchstart="touchSaleVolume"></canvas>
      </view>
    </view>
    <view class="root_tips" v-else>
      <image src="../../static/img/statistics/no_root.png" mode="widthFix"></image>
    </view>
  </view>

</template>

<script>
  import uCharts from '@/components/u-charts/u-charts.js'
  import SearchHeader from '@/components/p-search-header/SearchHeader.vue'
  import {
    httpStatisInfo
  } from '@/utils/request/api/statistics.js'
  import { mapState } from 'vuex'
  // import mapJson from '../../utils/mapData.js'
  var _self;
  var canvaMap = null;
  var canvaSaleMount = null
  var canvaSaleVolume = null
  export default {
    components: {
      SearchHeader
    },
    computed: {
      ...mapState(['XLoginInfo']),
      hasRoot () {
        const { level, role } = this.XLoginInfo
        const res = level === '1' && role === '1' || level === '2' && role === '1' || level === '3' && role === '1'
        return res
      },
      totalInfo() {
        switch (this.activeTimeNav) {
          case 1:
            return this.today_sale_info
          case 2:
            return this.week_sale_info
          case 3:
            return this.month_sale_info
          case 4:
            return this.all_sale_info
        }
      }
    },
    data() {
      return {
        activeTimeNav: 1,
        saleMoneyNav: 1,
        saleSumNav: 1,
        cWidth: '',
        cHeight: '',
        pixelRatio: 1,
        searchName: '',
        region: [],
        machine_sum: 0, // 机器总数
        today_sale_info: {}, // 今日销售详情
        week_sale_info: {}, // 本周销售详情
        month_sale_info: {}, // 本月销售详情
        all_sale_info: {}, // 总量销售详情
        province_info: [], // 点位分布详情(省份)
        CWeekSum: {},
        CWeekMoney: {},
        CMonthSum: {},
        CMonthMoney: {},
        barColor: ['#ee6b4f', '#90d7ae', '#f19f80', '#c1cc60', '#6ed3fa', '#c369c3', '#f6be62']
      }
    },
    onShow() {
      _self = this;
      this.cWidth = uni.upx2px(750);
      this.cHeight = uni.upx2px(800);
      this.getDataInfo()
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getDataInfo()
      },
      onSearch(value) {
        this.searchName = searchName
        this.getDataInfo()
      },
      onTimeChange(id) {
        this.activeTimeNav = id
      },
      onSaleMoneyNav(id) {
        this.saleMoneyNav = id
        if (id === 1) { // 周 - money
          this.initSaleMoney('sales_money_bar', this.CWeekMoney)
        } else { // 近半年 - money
          this.initSaleMoney('sales_money_bar', this.CMonthMoney)
        }
      },
      onSaleSumNav(id) {
        this.saleSumNav = id
        if (id === 1) { // 周 - sum
          this.initSaleSum('sales_sum_bar', this.CWeekSum)
        } else { // 近半年 - sum
          this.initSaleSum('sales_sum_bar', this.CMonthSum)
        }
      },
      initMap(canvasId, chartData) {
        canvaMap = new uCharts({
          $this: _self,
          canvasId: canvasId,
          type: 'pie',
          fontSize: 11,
          legend: {
            show: false
          },
          background: '#FFFFFF',
          pixelRatio: this.pixelRatio,
          series: chartData.series,
          animation: true,
          width: this.cWidth,
          height: uni.upx2px(800),
          dataLabel: true,
          extra: {
            pie: {
              lableWidth: 15
            }
          },
        })
      },
      initSaleMoney(canvasId, chartData) {
        canvaSaleMount = new uCharts({
          $this: this,
          canvasId: canvasId,
          type: 'column',
          padding: [20, 20, 20, 20],
          legend: {
            show: false
          },
          fontSize: 11,
          background: '#FFFFFF',
          pixelRatio: 1,
          animation: true,
          categories: chartData.categories,
          series: chartData.series,
          xAxis: {
            disableGrid: true,
            rotateLabel: true
          },
          yAxis: {
            //disabled:true
          },
          dataLabel: true,
          width: this.cWidth,
          height: uni.upx2px(400),
          extra: {
            column: {
              type: 'group',
              width: 20
            }
          }
        })
      },
      initSaleSum(canvasId, chartData) {
        canvaSaleVolume = new uCharts({
          $this: this,
          canvasId: canvasId,
          type: 'column',
          padding: [20, 20, 20, 20],
          legend: {
            show: false
          },
          fontSize: 11,
          background: '#FFFFFF',
          pixelRatio: 1,
          animation: true,
          categories: chartData.categories,
          series: chartData.series,
          xAxis: {
            disableGrid: true,
            rotateLabel: true
          },
          yAxis: {
            //disabled:true
          },
          dataLabel: true,
          width: this.cWidth,
          height: uni.upx2px(400),
          extra: {
            column: {
              type: 'group',
              width: 20
            }
          }
        });

      },
      touchMap(e) {
        canvaMap.showToolTip(e, {
          format: function(item) {
            return item.name + ':' + item.data
          }
        })
      },
      touchSaleMount(e) {
        canvaSaleMount.showToolTip(e, {
          format: item => {
            console.log(item)
            return `${item.name}:${item.data.value}`
          }
        })
      },
      touchSaleVolume(e) {
        canvaSaleVolume.showToolTip(e, {
          format: item => {
            console.log(item)
            return `${item.name}:${item.data.value}`
          }
        })
      },
      handleMapData(info) {
        const chartData = {}
        const series = []
        info.forEach(item => {
          const obj = {
            name: item.province,
            data: Number(item.province_sum)
          }
          series.push(obj)
        })
        chartData.series = series
        this.initMap('pos_map', chartData)
        // url: 'https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json'
      },
      handleWeekBarData(info) {
        const dataX = []
        const dataYSum = []
        const dataYMoney = []
        info.forEach((item, index) => {
          dataX.push(item.week_by_date)
          const objSum = {
            value: item.sum,
            color: this.barColor[index]
          }
          const objMoney = {
            value: item.money,
            color: this.barColor[index]
          }
          dataYSum.push(objSum)
          dataYMoney.push(objMoney)
        })
        // 周--销售量 sum
        this.CWeekSum = {
          categories: dataX,
          series: [{
            name: '销售量',
            data: dataYSum
          }]
        }
        // 周--销售额 money
        this.CWeekMoney = {
          categories: dataX,
          series: [{
            name: '销售额',
            data: dataYMoney
          }]
        }
        this.initSaleSum('sales_sum_bar', this.CWeekSum)
        this.initSaleMoney('sales_money_bar', this.CWeekMoney)
      },
      handleMonthBarData(info) {
        const dataX = []
        const dataYSum = []
        const dataYMoney = []
        info.forEach((item, index) => {
          dataX.push(item.month_by_date)
          const objSum = {
            value: item.sum,
            color: this.barColor[index]
          }
          const objMoney = {
            value: item.money,
            color: this.barColor[index]
          }
          dataYSum.push(objSum)
          dataYMoney.push(objMoney)
        })
        // 月--销售量 sum
        this.CMonthSum = {
          categories: dataX,
          series: [{
            name: '销售量',
            data: dataYSum
          }]
        }
        // 月--销售额 money
        this.CMonthMoney = {
          categories: dataX,
          series: [{
            name: '销售额',
            data: dataYMoney
          }]
        }
      },
      async getDataInfo() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpStatisInfo(params)
        this.machine_sum = msg.machine_sum
        this.today_sale_info = msg.today_sale_info
        this.week_sale_info = msg.week_sale_info
        this.month_sale_info = msg.month_sale_info
        this.all_sale_info = msg.all_sale_info
        this.handleWeekBarData(msg.week_sale_info1)
        this.handleMonthBarData(msg.month_sale_info1)
        this.handleMapData(msg.province_info)
      }
    }
  }
</script>

<style lang="less" scoped>
  .page_box {
    height: 100%;
    .root_tips {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30%;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }
  }

  .charts {
    width: 750rpx;
    // background-color: rgba(0, 0, 0, .2);
    background-color: #FFFFFF;
    // height: 800rpx;
  }

  .static_page {


    .total_box {
      padding: 9rpx;
      background-color: #FFFFFF;
      margin-top: 8rpx;

      .time_nav {
        height: 70rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;

        view {
          font-size: 30rpx;
          color: #666666;

          &.active {
            color: #FF5349;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: -8rpx;
              left: 0;
              width: 100%;
              height: 3rpx;
              background-color: #FF5349;
              border-radius: 1rpx;
            }
          }
        }

      }

      .totalize {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-around;

        .total_item {
          width: 362rpx;
          height: 110rpx;
          background: url(../../static/img/statistics/total_bg.png) no-repeat;
          background-size: contain;
          display: flex;
          justify-content: space-between;
          padding: 0 20rpx;
          align-items: center;
          box-sizing: border-box;
          color: #FFFFFF;
          opacity: 0.85;
          margin-top: 9rpx;

          .txt {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: left;
            font-size: 22rpx;

            .number {
              font-size: 40rpx;
            }
          }

          image {
            width: 70rpx;
          }
        }
      }
    }


    .charts_box {
      margin-top: 10rpx;
      padding: 12rpx;
      background-color: #FFFFFF;

      .charts_title {
        height: 40rpx;
        padding: 8rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .option {
          display: flex;
          align-items: center;
          font-size: 20rpx;

          view {
            // width: 74rpx;
            height: 40rpx;
            line-height: 40rpx;
            padding: 0 8rpx;
            text-align: center;
            vertical-align: middle;
            background-color: #EBEBEB;
            color: #999999;

            &:nth-of-type(1) {
              border-radius: 8rpx 0 0 8rpx;
            }

            &:nth-of-type(2) {
              border-radius: 0 8rpx 8rpx 0;
            }

            &.active {
              background-color: #ed6152;
              color: #FFFFFF;
            }
          }
        }
      }
    }
  }
</style>
