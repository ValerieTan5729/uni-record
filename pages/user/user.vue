<template>
  <view class="center">
    <!-- <view class="container loginCard" v-if="userInfo.phone === undefined"> -->
    <view class="container loginCard" v-if="!hasLogin">
      <uni-card
        mode="basic"
        note="欢迎使用电视台总值打卡系统"
        :is-shadow="true">
        <view style="display: block; width: 100%;">
          <image src="../../static/image/login.png" style="text-align: center; width: 100px; height: 100px;" />
          <br/>
          <text style="font-size: 16px; margin-bottom: 20upx;">请先进行登录</text>
          <br/>
          <button type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号登录</button>
        </view>
      </uni-card>
    </view>
    <view class="container basicCard" v-else>
      <view class="userInfoView">
        <image :src="userInfo.avatarUrl" class="avatarImage" />
        <view class="userNickname">
          <text class="userName">{{userInfo.nickName}}</text>
        </view>
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom" @click="getInfoDetail">
          <text class="iconfont">&#xe6de;</text>
          <text class="list-text">个人信息</text>
          <text class="iconfont">&#xe65b;</text>
        </view>
        <view class="center-list-item border-bottom" @click="getRecordDetail">
          <text class="iconfont">&#xe6e2;</text>
          <text class="list-text">打卡记录</text>
          <text class="iconfont">&#xe65b;</text>
        </view>
        <view class="center-list-item" v-if="isAdmin" @click="getAllRecord">
          <text class="iconfont">&#xe64f;</text>
          <text class="list-text">考勤记录</text>
          <text class="iconfont">&#xe65b;</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        hasLogin: false,
        userInfo: {},
        roles: [],
        isAdmin: false
      }
    },
    onLoad: function () {
      console.log(uni.getStorageSync('userInfo'))
      console.log(uni.getStorageSync('role'))
      this.userInfo = uni.getStorageSync('userInfo') || {}
      if (this.userInfo.phone && uni.getStorageSync('hasLogin')) {
        this.hasLogin = true
        this.roles = uni.getStorageSync('role') || []
        this.isAdmin = this.roles.some(item => item.name === 'ROLE_admin')
      }
    },
    onShow: function () {},
    methods: {
      getPhoneNumber (e) {
        console.log('get user phone')
        console.log(e)
        const that = this
        const param = {
          sessionKey: uni.getStorageSync('sessionKey'),
          signature: uni.getStorageSync('signature'),
          rawData: uni.getStorageSync('rawData'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
        this.getRequest('/wx/user/wxf55b5887b136a227/phone', param).then(resp => {
          if (resp) {
            console.log(resp)
            console.log(resp.obj)
            this.userInfo = Object.assign(this.userInfo, resp.obj.user)
            this.hasLogin = true
            this.roles = resp.obj.user.roles
            this.isAdmin = resp.obj.user.roles.some(item => item.name === 'ROLE_admin')
            console.log(this.userInfo)
            uni.setStorageSync('userInfo', this.userInfo)
            uni.setStorageSync('cookie', resp.obj.cookie)
            uni.setStorageSync('hasLogin', true)
            uni.setStorageSync('role', resp.obj.user.roles)
          } else {
            console.log('获取失败')
          }
        })
      },
      getInfoDetail () {
        console.log('get info detail function')
        uni.navigateTo({
          url: '/pages/user/info/info'
        })
      },
      getRecordDetail () {
        console.log('get record detail function')
        uni.navigateTo({
          url: '/pages/record/user/user?id=' + this.userInfo.id
        })
      },
      getAllRecord () {
        console.log('get all record (for admin)')
        uni.navigateTo({
          url: '/pages/duty/duty'
        })
      }
    }
  }
</script>

<style>
/*icon图标设置*/
@font-face {
  font-family: 'iconfont';
  src: url('/static/icon-font/iconfont.eot');
  src: url('/static/icon-font/iconfont.eot?#iefix') format('embedded-opentype'),
      url('/static/icon-font/iconfont.woff2') format('woff2'),
      url('/static/icon-font/iconfont.woff') format('woff'),
      url('/static/icon-font/iconfont.ttf') format('truetype'),
      url('/static/icon-font/iconfont.svg#iconfont') format('svg');
}
page {
  background-color: #F5F5F5;
}
page, view {
  display: flex;
}
.loginCard {
  display: block;
  width: 750upx;
  margin: 0;
  text-align: center;
}
.basicCard {
  display: flex;
  flex-direction: column;
}
.userInfoView {
  width: 750upx;
  height: 240upx;
  padding: 20upx;
  box-sizing: border-box;
  background-color: #FFFFFF;
  flex-direction: row;
  align-items: center;
}
.avatarImage {
  width: 150upx;
  height: 150upx;
  border-radius: 150upx;
}
.userNickname {
  height: 150upx;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-left: 20upx;
}
.userName {
  height: 60upx;
  line-height: 60upx;
  font-size: 38upx;
}
.center-list {
  background-color: #FFFFFF;
  margin-top: 20upx;
  width: 750upx;
  flex-direction: column;
}
.center-list-item {
  height: 90upx;
  width: 750upx;
  box-sizing: border-box;
  flex-direction: row;
  padding: 0upx 20upx;
}
.border-bottom {
  border-bottom-width: 1upx;
  border-color: #EAE9EE;
  border-bottom-style: solid;
}

.iconfont {
  font-family: "iconfont" !important;
  width: 40upx;
  height: 90upx;
  line-height: 90upx;
  font-size: 50upx;
  color: #0092FF;
  font-style: normal;
  text-align: center;
  margin-right: 20upx;
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
}

.list-text {
  height: 90upx;
  line-height: 90upx;
  font-size: 34upx;
  color: #191919;
  flex: 1;
  text-align: left;
}

</style>
