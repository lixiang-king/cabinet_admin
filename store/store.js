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
    XCntStatus: uni.getStorageSync('CNTSTATUS'),
    connectedDeviceId: uni.getStorageSync('connectingDeviceId'),
    services_UUID: uni.getStorageSync('services_UUID'),
    characteristic_UUID: uni.getStorageSync('characteristic_UUID'),
    discovering: uni.getStorageSync('discovering'),
    deviceList: [],
    available: uni.getStorageSync('available'),
    connected: false,
    deviceName: '',
    status: '',
    data: {},
    services: [],
    serviceId: '',
    writeServicweId: "",         // 可写服务uuid  
    writeCharacteristicsId: "",  // 可写特征值uuid  
    readServicweId: "",          // 可读服务uuid  
    readCharacteristicsId: "",   // 可读特征值uuid  
    configServicweId: "",       
     // 空中配置服务uuid  
    configCharacteristicsId: "", // 空中配置特征值uuid
    devicesList: []
  },
  mutations: {
    setwriteServicweId(state, provider) {
      state.writeServicweId = provider
      uni.setStorageSync('writeServicweId', provider)
    },
    setwriteCharacteristicsId(state, provider) {
      state.writeCharacteristicsId = provider
      uni.setStorageSync('writeCharacteristicsId', provider)
    },
    setreadServicweId(state, provider) {
      state.readServicweId = provider
      uni.setStorageSync('readServicweId', provider)
    },
    setreadCharacteristicsId(state, provider) {
      state.readCharacteristicsId = provider
      uni.setStorageSync('readCharacteristicsId', provider)
    },
    setconfigServicweId(state, provider) {
      state.configServicweId = provider
      uni.setStorageSync('configServicweId', provider)
    },
    setconfigCharacteristicsId(state, provider) {
      state.configCharacteristicsId = provider
      uni.setStorageSync('configCharacteristicsId', provider)
    },
    setServiceId(state, provider) {
      state.serviceId = provider
      uni.setStorageSync('serviceId', provider)
    },
    setServices(state, provider) {
      state.services = provider
      uni.setStorageSync('services', provider)
    },
    setData (state, provider) {
      state.data = provider
      uni.setStorageSync('data', provider)
    },
    setStatus (state, provider) {
      state.status = provider
      uni.setStorageSync('status', provider)
    },
    setDeviceName (state, provider) {
      state.deviceName = provider
      uni.setStorageSync('deviceName', provider)
    },
    setConnected (state, provider) {
      state.connected = provider
      uni.setStorageSync('connected', provider)
    },
    setAvailable (state, provider) {
      state.available = provider
      uni.setStorageSync('available', provider)
    },
    setDeviceList (state, provider) {
      state.deviceList = provider
      uni.setStorageSync('deviceList', provider)
    },
    setDiscovering (state, provider) {
      state.discovering = provider
      uni.setStorageSync('discovering', provider)
    },
    setConnectedDeviceId (state, provider) {
      state.connectedDeviceId = provider
      uni.setStorageSync('connectedDeviceId', provider)
    },
    setServicesUUID (state, provider) {
      state.services_UUID = provider
      uni.setStorageSync('services_UUID', provider)
    },
    setCharacteristicUUID (state, provider) {
      state.characteristic_UUID = provider
      uni.setStorageSync('characteristic_UUID', provider)
    },
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