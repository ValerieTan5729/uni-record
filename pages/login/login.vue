<template>
  <view>
    <view class="item">
      <image src="../../static/image/logo.png"></image>
    </view>
    <view class="item" style="margin-bottom: 20px;">
      <text>欢迎使用总值打卡系统</text>
    </view>
    <view class="item">
      <button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      getUserInfo (e) {
        console.log(e)
        if (e.detail.userInfo) {
          console.log('get user info', e.detail.userInfo)
          uni.setStorageSync('userInfo', e.detail.userInfo)
          uni.setStorageSync('rawData', e.detail.rawData)
          uni.setStorageSync('signature', e.detail.signature)
          // 跳转到"我的信息"页面
          uni.switchTab({
            url: '/pages/user/user'
          })
        } else {
          console.log('用户拒绝信息授权')
          uni.showModal({
            title: '提示',
            content: '请同意获取用户信息'
          })
        }
      },
    }
  }
</script>

<style>
.item {
  display: flex;
  justify-content: center;
}
image {
  width: 200px;
  height: 200px;
}
</style>
