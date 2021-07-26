<template>
  <view class="add_page">
    <view class="header"></view>
    <view class="edit_form">
      <view class="page_title">
        <view class="p_title">点位基本信息</view>
      </view>
      <view class="form_item">
        <view class="label"><text class="label_icon">点位名称</text></view>
        <input class="value" type="text" v-model="formInfo.place_name" placeholder="请填写点位名" />
      </view>
      <view class="form_item">
        <view class="label"><text class="label_icon">点位负责人</text></view>
        <input class="value" type="text" v-model="formInfo.place_person" placeholder="请填写点位负责人" />
      </view>
      <view class="form_item">
        <view class="label"><text class="label_icon">负责人电话</text></view>
        <input class="value" type="text" :maxlength="11" v-model="formInfo.place_person_tel" placeholder="请填写负责人电话" />
      </view>
      <view class="form_item">
        <view class="label"><text class="label_icon">点位电话</text></view>
        <input class="value" type="text" :maxlength="11" v-model="formInfo.place_tel" placeholder="请填写点位电话" />
      </view>
      <view class="form_item_other">
        <view class="label"><text>所在地区</text></view>
        <pick-regions :defaultRegion="region" @getRegion="handleGetRegion" style="height: 100%">
          <view :class="['region', regionStr ? '' : 'place_hd']" @click="onPickerOpen">{{ regionStr ? regionStr : '请选择省市区'}}</view>
        </pick-regions>
      </view>
      <view class="form_item_other">
        <view class="label"><text>详细地址</text></view>
        <input class="value" type="text" v-model="formInfo.address" placeholder="请填写详细地址" />
      </view>
    </view>
    <view class="bottom_btn" @click="onSubmit">
      提交信息
    </view>
  </view>
</template>

<script>
  import {
    httpPlaceAdd,
    httpPlaceInfo,
    httpPlaceUpdate
  } from '@/utils/request/api/position.js'
  export default {
    computed: {
      regionStr() {
        return this.region.join('')
      }
    },
    data() {
      return {
        formInfo: {
          place_name: '',
          place_person: '',
          place_person_tel: '',
          place_tel: '',
          address: ''
        },
        region: [],
        type: 1,
        isShowRegion: false
      }
    },
    methods: {
      onPickerOpen() {
        this.isShowRegion = !this.isShowRegion
      },
      handleGetRegion(region) {
        this.region = region
      },
      async getDetailInfo() {
        const params = {
          place_id: this.id
        }
        const { msg } = await httpPlaceInfo(params)
        this.formInfo = msg.place_info[0]
        this.region = [this.formInfo.province, this.formInfo.city, this.formInfo.area]
      },
      handleFormCheck(params) {
        const paramsRules = [{
            name: 'place_name',
            required: true,
            type: 'required',
            errmsg: '请输入点位名称'
          },
          {
            name: 'place_person',
            required: true,
            type: 'required',
            errmsg: '请输入点位负责人'
          },
          {
            name: 'place_person_tel',
            required: true,
            type: 'phone',
            errmsg: '请输入正确的点位负责人电话'
          },
          {
            name: 'place_tel',
            required: true,
            type: 'phone',
            errmsg: '请输入正确的点位电话'
          }
          // {
          //   name: 'province',
          //   required: true,
          //   type: 'required',
          //   errmsg: '请选择省市区'
          // },
          // {
          //   name: 'city',
          //   required: true,
          //   type: 'required',
          //   errmsg: '请选择省市区'
          // },
          // {
          //   name: 'area',
          //   required: true,
          //   type: 'required',
          //   errmsg: '请选择省市区'
          // },
          // {
          //   name: 'address',
          //   required: true,
          //   type: 'required',
          //   errmsg: '请输入详细地址'
          // }
        ]
        const regRes = this.$validate.validate(params, paramsRules)
        if (!regRes.isOk) {
          uni.showToast({
            title: regRes.errmsg,
            icon: 'none'
          })
          return false
        } else {
          return true
        }
      },
      async handlePlaceAdd(params) {
        const res = await httpPlaceAdd(params)
        uni.showToast({
          title: '添加成功'
        })
        uni.navigateTo({
          url: '/pages/position/position'
        })
      },
      async handlePlaceUpdate(params) {
        const res = await httpPlaceUpdate(params)
        uni.showToast({
          title: '编辑成功'
        })
        uni.navigateTo({
          url: '/pages/position/position'
        })
      },
      onSubmit() {
        const params = {
          ...this.formInfo
        }
        params.province = this.region[0] ? this.region[0] : ''
        params.city = this.region[1] ? this.region[1] : ''
        params.area = this.region[2] ? this.region[2] : ''
        const regRes = this.handleFormCheck(params)
        if (!regRes) return
        if (!this.id) { // 新增
          this.handlePlaceAdd(params)
        } else { // 编辑
          this.handlePlaceUpdate(params)
        }
      }
    },
    onLoad(option) {
      this.id = option.id
      console.log(this.id)
      if (this.id) { // 编辑
        this.getDetailInfo()
      } else { // 新增

      }
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
      height: 200rpx;
      background-color: #ff5449;
      // z-index: 1;
    }

    .edit_form {
      padding: 0rpx 10rpx;
      position: absolute;
      top: 30rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 710rpx;
      z-index: 2;
      background-color: #ffffff;
      border-radius: 6rpx;

      .page_title {
        margin: 20rpx 0;
        font-weight: bold;
      }

      .form_item {
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;
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
          color: #333333;
        }
      }

      .form_item_other {
        display: flex;
        flex-direction: column;
        padding: 10rpx 20rpx;
        border-bottom: 1rpx solid #b5b5b5;

        .region {
          color: #333333;
        }

        .place_hd {
          color: #999999;
        }

        .label {
          margin-bottom: 10rpx;
        }
      }

      .date_box {
        display: flex;
        color: #999999;

        .spliter {
          margin: 0 20rpx;
        }
      }
    }
  }
</style>
