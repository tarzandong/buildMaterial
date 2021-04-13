import Vue from 'vue'
import App from './App'
import store from './store'
import showMessage from './mixin/showMessage.js'
import request from './network/myrequest.js'

Vue.prototype.$store = store

Vue.prototype.$request=request

Vue.config.productionTip = false

Vue.mixin(showMessage)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
