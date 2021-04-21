import Vue from 'vue'
import App from './App'
import store from './store'
import request from './network/myrequest.js'

Vue.prototype.$store = store

Vue.prototype.$request=request

Vue.config.productionTip = false


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
