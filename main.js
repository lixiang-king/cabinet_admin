import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import SearchHeader from './components/p-search-header/SearchHeader.vue'
import PDatePicker from './components/p-date-picker/PDatePicker.vue'
import pSelect from '@/components/p-select/pSelect.vue'
import validate from '@/utils/validate/validate.js'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.component('SearchHeader', SearchHeader)
Vue.component('p-date-picker', PDatePicker)
Vue.component('pSelect', pSelect)
Vue.prototype.$validate = validate
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
