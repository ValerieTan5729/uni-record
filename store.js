import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// const now = new Date()

const store = new Vuex.Store({
  state: {
    hasLogin: false,
    userInfo: {}
  },
  mutations: {
    INIT_CURRENTUSER (state, user) {
      state.currentUser = user
    },
    login (state, provider) {
      console.log('登录打卡小程序，更新当前用户信息')
      state.hasLogin = true
      state.userInfo = provider
      uni.setStorageSync('userInfo', provider)
    },
    logout (state, provider) {
      console.log('登出打卡小程序，移除相应用户信息')
      state.hasLogin = false
      state.userInfo = {}
      uni.removeStorageSync('userInfo')
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo
    }
  }
})

export default store
