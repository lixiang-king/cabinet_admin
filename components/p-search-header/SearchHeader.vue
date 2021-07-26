<template>
  <view class="">
    <view class="header">
      <pick-regions :defaultRegion="region" @getRegion="handleGetRegion" style="height: 100%">
        <view class="region" @click="onPickerOpen">{{ region.length !== 0 ? region[region.length - 1] : '全国'}}</view>
      </pick-regions>
      <view class="search_box">
        <image class="search_icon" src="../../static/img/public/search.png" mode="widthFix"></image>
        <input class="search_input" type="text" confirm-type="search" value="" :placeholder="'请输入' + placeholder" @confirm="onSearch" />
      </view>
    </view>
  </view>
</template>

<script>
  const CHINA_REGIONS = require('@/components/pick-regions/regions.json')
  export default {
    computed: {
      regionName() {
        // 转为字符串
        return this.region.map(item => item.name).join('')
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        region: ['全部', '全部', '全部'],
        AddressCode: '100000',
        isShowRegion: false,
      }
    },
    onLoad() {
      this.initRegion()
    },
    methods: {
      onSearch(e) {
        const value = e.detail.value
        this.$emit('search', value)
      },
      onPickerOpen() {
        this.isShowRegion = !this.isShowRegion
      },
      handleGetRegion(region) {
        this.region = region
        this.$emit('regionOk', region)
      },
      initRegion() {
        this.$emit('regionOk', this.region)
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    height: 55rpx;
    display: flex;
    padding: 18rpx;
    // justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;

    .region {
      width: 120rpx;
      white-space: nowrap;
      overflow: hidden;
      padding-left: 18rpx;
      color: #595959;
      font-size: 30rpx;
      line-height: 55rpx;
    }

    .search_box {
      position: relative;

      .search_icon {
        width: 25rpx;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15rpx;
      }

      .search_input {
        width: 500rpx;
        height: 55rpx;
        background-color: #EBEBEB;
        border-radius: 10rpx;
        font-size: 24rpx;
        padding-left: 50rpx;
      }
    }

  }
</style>
