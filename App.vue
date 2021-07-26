<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="less">
/*每个页面公共css */
page {
  background-color: #f3f3f3;
  font-size: 30rpx;
  image {
    height: auto;
  }
  // 带前缀的标题
  .p_title {
    // margin-bottom: 20rpx;
    position: relative;
    padding-left: 18rpx;
    font-size: 30rpx;
    opacity: 0.9;
    background-color: #ffffff;

    &::before {
      content: "";
      width: 6rpx;
      height: 30rpx;
      background-color: #ff5449;
      border-radius: 2rpx;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
  }
  // 底部按钮
  .bottom_btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff5449;
    color: #ffffff;
    z-index: 2;

    image {
      width: 50rpx;
      margin-right: 20rpx;
    }
  }
  .c_ac_color {
    color: #ff5349;
  }
  .c_border_btm {
    border-bottom: 1rpx solid #dddddd;
  }
  .c_box_shadow {
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
  }
  .c_empty_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8a8a8a;
    margin-top: 30%;
    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
  // 总计
  .c_header_total {
    position: relative;
    width: 100%;
    height: 100rpx;
    // line-height: 100rpx;
    margin: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(/static/img/manage/device_total_bg.png) no-repeat;
    background-size: contain;
    font-size: 24rpx;
    color: rgba(255, 255, 255, .84);
  
    .total_title {
      position: absolute;
      left: 20rpx;
      top: 15rpx;
      display: flex;
      align-items: center;
  
      image {
        width: 25rpx;
        margin-right: 4rpx;
      }
    }
  
    .number {
      vertical-align: baseline;
  
      text {
        color: #FFFFFF;
        font-size: 60rpx;
        margin-right: 20rpx;
      }
    }
  
  }
}
</style>
