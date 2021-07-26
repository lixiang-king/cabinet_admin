<template>
  <view class="add_page">
    <view class="header"></view>
    <view class="edit_form">
      <!-- <view class="p_title">{{ typeName }}基本信息</view>
      <view class="form_item">
        <view class="label"><text class="label_icon">姓名</text></view>
        <input class="value" type="text" v-model="dataInfo.name" placeholder="请输入姓名" />
      </view>
      <view class="form_item">
        <view class="label"><text class="label_icon">电话</text></view>
        <input class="value" type="text" :maxlength="11" v-model="dataInfo.tel" placeholder="请输入电话" />
      </view>
      <view class="form_item_other">
        <view class="label"><text class="label_icon">所在地区</text></view>
        <pick-regions :defaultRegion="region" @getRegion="handleGetRegion">
          <view :class="['value', regionName ? '' : 'place_hd']" style="fontSize: 30rpx; width: 400rpx;">{{ regionName ? regionName : '请选择'}}</view>
        </pick-regions>
      </view> -->
      <view class="form_item_other">
        <view class="label"><text class="label_icon">绑定点位</text></view>
        <view class="value place_hd" @click="showModal">选择点位</view>
      </view>
      <view class="form_item_other">
        <view class="label"><text class="label_icon">持有点位</text></view>
        <!-- <input class="value" type="text" v-model="dataInfo.tel" placeholder="选择点位" /> -->
        <view class="place_already" v-if="already_bind_place.length">
          <view class="place_item" v-for="item in already_bind_place" :key="item.place_id">
            <view>{{ item.place_name }}</view>
            <view class="unbind_btn" @click="onUnbind(item.place_id)">
              解绑
            </view>
          </view>
        </view>
        <view v-else class="place_already">
          <view class="place_item">
            暂无持有点位
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="bottom_btn" @click="onSubmit">
      <image src="../../static/img/user/role-agent-commit.png" mode="widthFix"></image>
      提交信息
    </view> -->
    <!-- 选择点位 -->
    <view class="pop_mask" v-show="isModalShow" catchtouchmove="ture" @click="hideModal">
      <view class="pop_box" @click.stop="stopEvent">
        <view class="check_box">
          <checkbox-group @change="onCheckAllChange">
            <label class="checkbox_item">
              <checkbox :value="isAllChecked" :checked="isAllChecked" />
              <view>全选</view>
            </label>
          </checkbox-group>
          <scroll-view scroll-y="true" class="scroll_box">
              <checkbox-group @change="checkboxChange">
                <label class="checkbox_item" v-for="item in bind_place" :key="item.place_id">
                  <checkbox :value="item.place_id" :checked="item.checked" />
                  <view>{{item.place_name}}</view>
                </label>
              </checkbox-group>
          </scroll-view>
          
        </view>
        <view class="primary_btn" @click="onSelectOk">确认选择</view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    httpUserIntroInfo,
    httpUserMarketInfo,
    httpUserIntroBind,
    httpUserMarketBind,
    httpUserIntroUnbind,
    httpUserMarketUnbind
  } from '@/utils/request/api/user.js'
  export default {
    computed: {
      // regionName() {
      //   return this.region.join('')
      // },
      typeName() {
        switch (this.type) {
          case 3:
            return '介绍人'
          case 4:
            return '营销人员'
          default:
            return ''
        }
      },
      isAllChecked() {
        if (this.checkedIds.length === this.bind_place.length) {
          return true
        } else {
          return false
        }
      }
    },
    data() {
      return {
        id: '',
        type: -1,
        isModalShow: false,
        bind_place: [],
        already_bind_place: [],
        checkedIds: []
      }
    },
    methods: {
      stopEvent() {},
      hideModal() {
        this.isModalShow = false
      },
      showModal() {
        this.checkedIds = this.already_bind_place.map(item => item.place_id)
        this.bind_place.forEach(item => {
          if (this.checkedIds.includes(item.place_id)) {
            item.checked = true
          }
        })
        this.isModalShow = true
      },
      onSelectOk() {
        if (this.type === 3) {
          this.handleUserIntroBind()
        } else if (this.type === 4) {
          this.handleUserMarketBind()
        } else {}

        this.isModalShow = false
      },
      // handleGetRegion(region) {
      //   this.region = region
      // },
      onCheckAllChange(e) {
        const res = e.detail.value
        if (res[0]) { // 选中全选
          this.bind_place.map(item => item.checked = true)
          this.checkedIds = this.bind_place.map(item => item.place_id)
        } else {
          this.bind_place.map(item => item.checked = false)
          this.checkedIds = []
        }
      },
      checkboxChange(e) {
        var items = this.bind_place
        var values = e.detail.value
        this.checkedIds = values
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
          const item = items[i]
          if (values.includes(item.place_id)) {
            this.$set(item, 'checked', true)
          } else {
            this.$set(item, 'checked', false)
          }
          
        }
      },
      handleUserIntroUnbind(params) {
        httpUserIntroUnbind(params).then(res => {
          uni.showToast({
            title: '解绑成功'
          })
          this.getIntroInfo()
        })
      },
      handleUserMarketUnbind(params) {
        httpUserMarketUnbind(params).then(res => {
          uni.showToast({
            title: '解绑成功'
          })
          this.getMarketInfo()
        })
      },
      onUnbind(id) {
        uni.showModal({
          title: '提示',
          content: '确定解绑？',
          success: res => {
            if (res.confirm) {
              const params = {
                place_id: id
              }
              if (this.type === 3) {
                this.handleUserIntroUnbind(params)
              } else if (this.type === 4) {
                this.handleUserMarketUnbind(params)
              }
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      handleUserIntroBind() {
        const params = {
          introducer_id: this.id,
          place_id: this.checkedIds.join(',')
        }
        httpUserIntroBind(params).then(res => {
          uni.showToast({
            title: '绑定成功'
          })
          this.getIntroInfo()
        })
      },
      handleUserMarketBind() {
        const params = {
          marketing_id: this.id,
          place_id: this.checkedIds.join(',')
        }
        httpUserMarketBind(params).then(res => {
          uni.showToast({
            title: '绑定成功'
          })
          this.getMarketInfo()
        })
      },
      async getIntroInfo() {
        const params = {
          introducer_id: this.id
        }
        const {
          msg
        } = await httpUserIntroInfo(params)
        // this.dataInfo = msg.introducer_info
        this.bind_place = msg.not_bind_place
        this.already_bind_place = msg.already_bind_place
      },
      async getMarketInfo() {
        const params = {
          marketing_id: this.id
        }
        const {
          msg
        } = await httpUserMarketInfo(params)
        // this.dataInfo = msg.marketing_info
        this.bind_place = msg.bind_place
        this.already_bind_place = msg.already_bind_place
      }
    },
    onLoad(option) {
      this.id = option.id
      this.type = Number(option.type)
      console.log(this.type, 110)
      if (this.type === 3) {
        this.getIntroInfo()
      } else if (this.type === 4) {
        this.getMarketInfo()
      } else {}
    }
  }
</script>

<style lang="less" scoped>
  .add_page {
    position: relative;

    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 162rpx;
      background-color: #ff5449;
      // z-index: 1;
    }

    .edit_form {
      padding: 30rpx 10rpx;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 710rpx;
      // height: 1050rpx;
      z-index: 2;
      background-color: #ffffff;
      border-radius: 6rpx;

      .form_item {
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
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
      }

      .form_item_other {
        display: flex;
        flex-direction: column;
        padding: 10rpx 20rpx;
        border-bottom: 1rpx solid #b5b5b5;
        &:nth-last-of-type(1) {
          border: none;
        }

        .region {
          color: #333333;
        }

        .place_hd {
          color: #999999;
        }

        .label {
          margin-bottom: 10rpx;
        }

        .place_already {
          .place_item {
            margin: 10rpx 0;
            display: flex;
            justify-content: space-between;
            color: #999999;

            .unbind_btn {
              padding: 0 20rpx;
              background-color: #ed615c;
              color: #FFFFFF;
              border-radius: 5rpx;
            }
          }
        }
      }
    }

  }

  .pop_mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    // opacity: 0;
    top: 0;
    left: 0;
    z-index: 999;

    // bottom: 0;
    // right: 0;
    .pop_box {
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 60rpx 30rpx;
      margin-left: 50%;
      transform: translate(-50%);
      display: flex;
      flex-direction: column;
      // align-items: center;
      background-color: #fff;
      border-radius: 30rpx 30rpx 0 0;

      .check_box {
        // height: 500rpx;
        // overflow-y: auto;
        .scroll_box {
          height: 500rpx;
        }
        .checkbox_item {
          display: flex;
          // justify-content: space-between;
          border-bottom: 1rpx solid #EEEEEE;
          margin-bottom: 20rpx;
          padding-bottom: 20rpx;

          .selectAll {
            font-weight: bold;
          }
        }
      }

      .primary_btn {
        margin: auto;
        margin-top: 20rpx;
        width: 80%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff5449;
        color: #ffffff;
        border-radius: 6rpx;
      }
    }
  }
</style>
