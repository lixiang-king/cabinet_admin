<template>
  <view>
    <SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="container">
      <view class="edit_form">
        <view class="p_title">设备入驻</view>
        <view class="form_item">
          <view class="label"><text class="label_icon">点位</text></view>
          <pSelect :range="selectList" @pickOk="onPickOk"></pSelect>
        </view>
        <view class="form_item">
          <view class="label"><text class="label_icon">设备号</text></view>
          <input class="value" type="text" v-model="formInfo.machineid" placeholder="请扫描设备二维码" />
          <image :src="require('@/static/img/manage/manage_scan.png')" mode="widthFix" @click="onScan"></image>
        </view>
        <view class="form_item">
          <view class="label"><text class="label_icon">位置编号</text></view>
          <input class="value" type="text" v-model="formInfo.position_num" placeholder="请填写位置编号" />
        </view>
      </view>
      <view class="btn save_btn" @click="onSubmit">保 存</view>
      <!-- <view class="btn clear_btn" @click="onReset">清除信息</view> -->
    </view>
  </view>

</template>

<script>
  import {
    httpPlaceInfo,
    httpMachineSettle
  } from '@/utils/request/api/device.js'
  import pSelect from '@/components/p-select/pSelect.vue'
  export default {
    components: {
      pSelect
    },
    data() {
      return {
        formInfo: {
          machineid: '',
          position_num: ''
        },
        place_id: '',
        searchName: '',
        selectList: [],
        region: [],
        placeInfo: {},
        isPickerShow: false
      };
    },
    methods: {
      onPickOk (obj) {
        console.log(obj, 54)
        this.placeInfo = obj
        this.getPlaceInfo()
      },
      onSelectRegion(region) {
        this.region = region
        this.getPlaceInfo()
      },
      onSearch(value) {
        this.searchName = value
        this.getPlaceInfo()
      },
      // onReset () {
      //   this.formInfo = {}
      // },
      onScan() {
        uni.scanCode({
          // scanType: ['barCode'],
          success: res => {
            const { result } = res
            // https://me.dc-box.com/scode/A20081001022
            const deviceNum = result.slice(result.length - 12, result.length)
            this.formInfo.machineid = deviceNum
          }
        })
      },
      async getPlaceInfo() {
        const params = {
          place_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : '',
        }
        const { msg } = await httpPlaceInfo(params)
        const selectList = msg.place_info
        selectList.unshift({place: '请选择', place_id: null })
        this.selectList = selectList
      },
      onSubmit() {
        const params = {...this.formInfo}
        params.place = this.placeInfo.place
        params.place_id = this.placeInfo.place_id
        if (!params.place_id) return uni.showToast({
          title: '请选择点位',
          icon: 'none'
        })
        if (!params.machineid) return uni.showToast({
          title: '请输入设备编号',
          icon: 'none'
        })
        if (!params.position_num) return uni.showToast({
          title: '请输入位置编号',
          icon: 'none'
        })

        httpMachineSettle(params).then(res => {
          uni.showToast({
            title: '设备入驻成功'
          })
          this.formInfo.position_num = ''
            // uni.redirectTo({
            //   url: '/pages/device/device'
            // })
        })
      }
    },
    onLoad() {
      this.getPlaceInfo()
    }
  }
</script>

<style lang="less">
  .container {
    width: 700rpx;
    margin: auto;
    margin-top: 20rpx;
    background-color: #FFFFFF;
    padding: 30rpx 10rpx;
    padding-bottom: 44rpx;
    border-radius: 5rpx;
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;

    .edit_form {
      .form_item {
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
        border-bottom: 1rpx solid #b5b5b5;
        font-size: 30rpx;

        .label {
          width: 120rpx;
          text-align: left;
          margin-right: 60rpx;
          color: rgba(0, 0, 0, 0.8);
        }

        .value {
          color: #000000;
          font-size: 30rpx;
        }

        image {
          width: 40rpx;
        }
      }
    }

    .btn {
      width: 687rpx;
      height: 70rpx;
      line-height: 70rpx;
      margin: auto;
      color: #fef7f3;
      text-align: center;
      border-radius: 6rpx;
      font-size: 30rpx;
    }

    .save_btn {
      background-color: #FF8D35;
      margin-top: 66rpx;
    }

    .clear_btn {
      background-color: #969696;
      // margin: 44rpx;
      margin-top: 44rpx;
    }
  }
</style>
