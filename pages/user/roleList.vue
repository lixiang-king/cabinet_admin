<template>
  <view class="agent">
    <view class="agents_list" v-if="dataList.length">
      <view class="list_item" v-for="item in dataList" :key="item.id">
        <view class="item_l" @click="onDetail(item)">
          <image src="../../static/img/user/role-agent.png" mode="widthFix"></image>
          <view class="info">
            <view class="agent_name">{{ item.name }}</view>
            <view>{{ item.tel }}</view>
          </view>
        </view>
        <image class="del_btn" src="../../static/img/user/market-delete.png" mode="widthFix" @click="onDelete(item)"></image>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
    <view class="bottom_btn" @click="() => { isModalShow = true }">
      <image src="../../static/img/user/role-agent-add.png" mode="widthFix"></image>
      添加{{ typeName }}
    </view>
    <!-- 添加 - 弹窗 -->
    <view class="pop_mask" v-show="isModalShow" catchtouchmove="ture" @click="hideModal">
      <view class="pop_box" @click.stop="stopEvent">
        <view class="pop_title">
          添加{{ typeName }}
        </view>
        <view class="inp_item">
          <view class="title">姓名:</view>
          <input type="text" placeholder="请输入姓名" v-model="addForm.username" />
        </view>
        <view class="inp_item">
          <view class="title">电话:</view>
          <input type="number" maxlength="11" placeholder="请输入电话" v-model="addForm.phone" />
        </view>
        <view class="primary_btn" @click="onSubmit">提交</view>
      </view>
    </view>
  </view>
</template>
<script>
  import {
    httpUserOpList,
    httpUserBhList,
    httpUserIntroList,
    httpUserMarketList,
    httpUserOpAdd,
    httpUserBhAdd,
    httpUserIntroAdd,
    httpUserMarketAdd,
    httpUserOpDel,
    httpUserBhDel,
    httpUserIntroDel,
    httpUserMarketDel
  } from '@/utils/request/api/user.js'
  export default {
    computed: {
      typeName() {
        switch (this.type) {
          case 1:
            return '运维'
          case 2:
            return '补货员'
          case 3:
            return '介绍人'
          case 4:
            return '营销人员'
          default:
            return ''
        }
      }
    },
    data() {
      return {
        type: 1,
        dataList: [],
        isModalShow: false,
        addForm: {}
      }
    },
    methods: {
      stopEvent() {},
      hideModal() {
        this.isModalShow = false
        this.getDataList()
      },
      onDelete(item) {
        uni.showModal({
          title: '删除',
          content: '确定删除该' + this.typeName + '吗？',
          success: res => {
            if (res.confirm) {
              if (this.type === 1) {
                this.handleOpDel({
                  operation_id: item.id
                })
              } else if (this.type === 2) {
                this.handleBhDel({
                  bh_person_id: item.id
                })
              } else if (this.type === 3) {
                this.handleIntroDel({
                  introducer_id: item.id
                })
              } else if (this.type === 4) {
                this.handleMarketDel({
                  marketing_id: item.id
                })
              } else {}
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        })
      },
      handleOpDel(params) {
        httpUserOpDel(params).then(res => {
          uni.showToast({
            title: '删除成功'
          })
          this.getDataList()
        })
      },
      handleBhDel(params) {
        httpUserBhDel(params).then(res => {
          uni.showToast({
            title: '删除成功'
          })
          this.getDataList()
        })
      },
      handleIntroDel(params) {
        httpUserIntroDel(params).then(res => {
          uni.showToast({
            title: '删除成功'
          })
          this.getDataList()
        })
      },
      handleMarketDel(params) {
        httpUserMarketDel(params).then(res => {
          uni.showToast({
            title: '删除成功'
          })
          this.getDataList()
        })
      },
      onDetail(item) {
        if (this.type === 3 || this.type === 4) {
          uni.navigateTo({
            url: '/pages/user/roleEdit?id=' + item.id + '&type=' + this.type
          })
        }
      },
      handleOpAdd(params) {
        httpUserOpAdd(params).then(res => {
          uni.showToast({
            title: '添加成功'
          })
          this.hideModal()
        })
      },
      handleBhAdd(params) {
        httpUserBhAdd(params).then(res => {
          uni.showToast({
            title: '添加成功'
          })
          this.hideModal()
        })
      },
      handleIntroAdd(params) {
        httpUserIntroAdd(params).then(res => {
          uni.showToast({
            title: '添加成功'
          })
          this.hideModal()
        })
      },
      handleMarketAdd(params) {
        httpUserMarketAdd(params).then(res => {
          uni.showToast({
            title: '添加成功'
          })
          this.hideModal()
        })
      },
      onSubmit() {
        const {
          username,
          phone
        } = this.addForm
        if (!username) return uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        if (!phone) return uni.showToast({
          title: '请输入电话',
          icon: 'none'
        })

        if (this.type === 1) {
          const params = {
            operation_name: username,
            operation_tel: phone
          }
          this.handleOpAdd(params)
        } else if (this.type === 2) {
          const params = {
            bh_person_name: username,
            bh_person_tel: phone
          }
          this.handleBhAdd(params)
        } else if (this.type === 3) {
          const params = {
            introducer_name: username,
            introducer_tel: phone
          }
          this.handleIntroAdd(params)
        } else if (this.type === 4) {
          const params = {
            marketing_name: username,
            marketing_tel: phone
          }
          this.handleMarketAdd(params)
        } else {}
      },
      async handleOpData() {
        const { msg } = await httpUserOpList()
        this.dataList = msg.operation_list
      },
      async handleBhData() {
        const { msg } = await httpUserBhList()
        this.dataList = msg.bh_person_list
      },
      async handleIntroData() {
        const { msg } = await httpUserIntroList()
        this.dataList = msg.introducer_list
      },
      async handleMarketData() {
        const { msg } = await httpUserMarketList()
        this.dataList = msg.marketing_list
      },
      getDataList() {
        if (this.type === 1) {
          this.handleOpData()
        } else if (this.type === 2) {
          this.handleBhData()
        } else if (this.type === 3) {
          this.handleIntroData()
        } else if (this.type === 4) {
          this.handleMarketData()
        } else {}
      }
    },
    onLoad(option) {
      this.type = Number(option.type)
      uni.setNavigationBarTitle({
        title: this.typeName
      })
      this.getDataList()
    }
  }
</script>
<style lang="less" scoped>
  .search_block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
    padding: 16rpx 20rpx;

    .search_input {
      position: relative;
      display: flex;
      justify-content: enter;
      align-items: center;

      image {
        width: 25rpx;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15rpx;
      }

      input {
        width: 600rpx;
        height: 50rpx;
        background-color: #EBEBEB;
        border-radius: 10rpx;
        font-size: 24rpx;
        padding-left: 50rpx;
      }
    }

    .search {
      font-size: 28rpx;
      width: 57rpx;
    }
  }

  .agents_list {
    padding: 10rpx;
    margin-bottom: 100rpx;

    .list_item {
      width: 100%;
      height: 116rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      padding: 8rpx;
      margin-top: 10rpx;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
      border-radius: 4rpx;
      box-sizing: border-box;

      .item_l {
        width: 650rpx;
        display: flex;
        align-items: center;

        image {
          width: 86rpx;
          height: 86rpx;
          margin-right: 30rpx;
        }

        .info {
          display: flex;
          flex-direction: column;
          align-items: left;
          font-size: 24rpx;
          color: rgba(0, 0, 0, .5);

          .agent_name {
            font-size: 30rpx;
            color: rgba(0, 0, 0, .9);
          }
        }
      }

      .del_btn {
        width: 40rpx;
        height: 40rpx;
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
      width: 80%;
      padding: 60rpx 30rpx;
      // position: fixed;
      margin-top: 150rpx;
      margin-left: 50%;
      transform: translate(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      border-radius: 30rpx;
      .pop_title {
        text-align: center;
        font-weight: bold;
        font-size: 30rpx;
        margin-bottom: 30rpx;
      }
      .inp_item {
        margin-bottom: 20rpx;
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1rpx solid #dddddd;
      }

      .primary_btn {
        margin-top: 30rpx;
        width: 100%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff5449;
        color: #ffffff;
        border-radius: 10rpx;
      }
    }
  }
</style>
