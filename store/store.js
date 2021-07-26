import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({  
  state: {
    XBLECUrl: 'https://api.bannuocx.com',
    XBlecUserType: 1,
    XOpenId: uni.getStorageSync('OPENID'),
    XIsLogin: uni.getStorageSync('ISLOGIN'),
    XPlaceId: uni.getStorageSync('PLACEID'),
    XLoginInfo:uni.getStorageSync('LOGININFO'),
    XUserInfo:uni.getStorageSync('USERINFO'),
    XChannelId: uni.getStorageSync('CHANNELID'),
    XLoginForm: uni.getStorageSync('LOGINFORM'),
    // 蓝牙
    XDeviceCode: uni.getStorageSync('DEVICECODE'), // A20081001022
    XDevCode: uni.getStorageSync('DEVCODE'), // 81001022
    XDeviceId: uni.getStorageSync('DEVICEID'), // F6:71:48:64:25:37
    XDevInfo: uni.getStorageSync('DEVICEINFO'), 
    // RSSI: -65
    // advertisData: ArrayBuffer(29) {}
    // advertisServiceUUIDs: ["0B49ABF0-C6FC-411D-8456-535AF817DAC8"]
    // deviceId: "F6:71:48:64:25:37"
    // localName: "81001022"
    // name: "81001022"
    // serviceData: {}
    XBattery: uni.getStorageSync('BATTERY'),
    XHexData: uni.getStorageSync('HEXDATA'),
    XCntStatus: uni.getStorageSync('CNTSTATUS')
  },
  mutations: {
    setOpenId (state, provider) {
      state.XOpenId = provider
      uni.setStorageSync('OPENID', provider)
    },
    setPlaceId (state, provider) {
      state.XPlaceId = provider
      uni.setStorageSync('PLACEID', provider)
    },
    setIsLogin (state, provider) {
      state.XIsLogin = provider
      uni.setStorageSync('ISLOGIN', provider)
    },
    setLoginInfo (state, provider) {
      state.XLoginInfo = provider
      uni.setStorageSync('LOGININFO', provider)
    },
    setUserInfo (state, provider) {
      state.XUserInfo = provider
      uni.setStorageSync('USERINFO', provider)
    },
    setChannelId (state, provider) {
      state.XChannelId = provider
      uni.setStorageSync('CHANNELID', provider)
    },
    setLoginForm (state, provider) {
      state.XLoginForm = provider
      uni.setStorageSync('LOGINFORM', provider)
    },
    setDeviceCode (state, provider) {
      state.XDeviceCode = provider
      state.XDevCode = provider.slice(provider.length - 8, provider.length)
      uni.setStorageSync('DEVICECODE', provider)
      uni.setStorageSync('DEVCODE', provider)
    },
    setDeviceId (state, provider) {
      state.XDeviceId = provider
      uni.setStorageSync('DEVICEID', provider)
    },
    setDevInfo (state, provider) {
      state.XDevInfo = provider
      uni.setStorageSync('DEVICEINFO', provider)
    },
    setHexData (state, provider) {
      state.XHexData = provider
      uni.setStorageSync('HEXDATA', provider)
    },
    setBattery (state, provider) {
      state.XBattery = provider
      uni.setStorageSync('BATTERY', provider)
    },
    setCntStatus (state, provider) {
      state.XCntStatus = provider
      uni.setStorageSync('CNTSTATUS', provider)
    }
  },
  getters: {
    GDevCode: state => {
      return state.XDeviceCode.slice(state.XDeviceCode.length - 8, state.XDeviceCode.length)
    }
  }
})

export default store