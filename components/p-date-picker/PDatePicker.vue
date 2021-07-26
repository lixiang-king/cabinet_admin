<template>
  <view class="date_picker_page">
    <view class="label">时间选择</view>
    <view class="value">
       <picker mode="date" :value="date" @change="onStartDateChange">
         <view class="start_date">{{start_date}}</view>
       </picker>
       <view class="spliter">-</view>
       <picker mode="date" :value="date" @change="onEndDateChange">
         <view class="end_date">{{end_date}}</view>
       </picker>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        date: '',
        start_date: '开始时间',
        end_date: '结束时间'
      };
    },
    methods: {
      onStartDateChange (e) {
        const res = e.target.value
        this.start_date = res
        this.$emit('start', res)
      },
      onEndDateChange (e) {
        const res = e.target.value
        this.end_date = res
        this.$emit('end', res)
      }
    }
  }
</script>

<style lang="less">
  .date_picker_page {
    padding: 0 30rpx;
    height: 70rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #bcbcbc;
    font-size: 30rpx;
    .label {
      width: 120rpx;
      // margin-right: 36rpx;
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
</style>
