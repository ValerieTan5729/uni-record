import Vue from 'vue'
import store from './store'
import App from './App'

// import { postRequest, putRequest, getRequest, deleteRequest } from './utils/api'

import { getRequest, postRequest, uploadRequest } from './utils/api'

// Vue.config.productionTip = false

App.mpType = 'app'

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

let userInfo = undefined

const logout = () => {
	userInfo = undefined
	uni.removeStorage({
		key: 'userInfo'
	})
}

const setUserInfo = (i) => {
	userInfo = i
}

Vue.prototype.$fire = new Vue()
Vue.prototype.store = store
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.uploadRequest = uploadRequest

Vue.config.productionTip = false

const app = new Vue({
	...App
})
app.$mount()
