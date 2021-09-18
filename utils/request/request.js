import store from '../../store/store.js'
export default {
  config: {
    baseUrl: "https://applet.dc-box.com",
    // header: {
    //   // 'Content-Type':'application/json;charset=UTF-8',
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Cookie': 'ci_session=' + store.state.XLoginInfo.token
    // },
    data: {},
    method: "GET",
    dataType: "json",
    responseType: "text",
    success() {},
    fail() {},
    complete() {}
  },
  interceptor: {
    request: null,
    response: null
  },
  request(options) {
    if (!options) {
      options = {}
    }
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    options.url = options.baseUrl + options.url
    options.data = options.data || {}
    options.method = options.method || this.config.method
    options.header = {
      // 'Content-Type':'application/json;charset=UTF-8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'ci_session=' + store.state.XLoginInfo.token
    }
    return new Promise((resolve, reject) => {
      let _config = null

      options.complete = (response) => {
        let statusCode = response.statusCode
        response.config = _config

        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response)
          if (newResponse) {
            response = newResponse
          }
        }

        if (statusCode === 200) { //成功
          const { data } = response
          if (data.login == '-1') {
            uni.showModal({
            	title: '系统提示',
            	content: '登录已过期，请重新登录',
            	success: res => {
                if (res.confirm) {
                	store.commit('setIsLogin', false)
                	store.commit('setLoginInfo', {})
                	uni.navigateTo({
                	  url: '/pages/login/login'
                	})
                } else if (res.cancel) {
                	console.log('用户点击取消');
                }
            	}
            })
            reject(data)
          }
          if (data.code === 1) {
            resolve(data)
          } else {
            uni.showToast({
              title: data.msg,
              icon: 'none'
            })
            reject(data)
          }
        } else {
          switch (statusCode) {
            case 404:
              uni.showModal({
                title: '系统提示',
                content: '很抱歉，资源未找到'
              })
              break
            case 403:
            case 401:
              uni.showModal({
                title: '系统提示',
                content: '您无法访问该资源'
              })
              break
            case 500:
              uni.showModal({
                title: '系统提示',
                content: '系统内部异常，请联系网站管理员'
              })
              break
            default:
              break
          }
          reject(response)
        }
      }

      _config = Object.assign({}, this.config, options)
      _config.requestId = new Date().getTime()

      if (this.interceptor.request) {
        this.interceptor.request(_config)
      }
      uni.request(_config);
    });
  }
}
