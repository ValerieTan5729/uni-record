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
          <text class="iconfont">&#xe613;</text>
          <text class="list-text">个人信息</text>
          <text class="iconfont">&#xe65b;</text>
        </view>
        <view class="center-list-item border-bottom" @click="getRecordDetail">
          <text class="iconfont">&#xe621;</text>
          <text class="list-text">我的打卡记录</text>
          <text class="iconfont">&#xe65b;</text>
        </view>
        <view class="center-list-item" v-if="isAdmin" @click="getAllRecord">
          <text class="iconfont">&#xe64d;</text>
          <text class="list-text">全部打卡记录</text>
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
      console.log('phone is ', this.userInfo.phone, ', hasLogin = ', uni.getStorageSync('hasLogin'))
      if (this.userInfo.phone && uni.getStorageSync('hasLogin')) {
        console.log('用户已经登录')
        this.hasLogin = true
        this.roles = uni.getStorageSync('role') || []
        this.isAdmin = this.roles.some(item => item.name === 'ROLE_admin')
      }
    },
    onShow: function () {
      console.log('user page on show')
      this.userInfo = uni.getStorageSync('userInfo') || {}
      console.log('phone is ', this.userInfo.phone, ', hasLogin = ', uni.getStorageSync('hasLogin'))
      if (this.userInfo.phone && uni.getStorageSync('hasLogin')) {
        console.log('用户已经登录')
        this.hasLogin = true
        this.roles = uni.getStorageSync('role') || []
        this.isAdmin = this.roles.some(item => item.name === 'ROLE_admin')
      } else {
        this.hasLogin = false
      }
    },
    methods: {
      getPhoneNumber (e) {
        if (e.detail.encryptedData && e.detail.iv) {
          uni.showLoading({
              title: '登录中'
          });
          console.log('get user phone')
          console.log(e)
          const that = this
          let param = {
            sessionKey: uni.getStorageSync('sessionKey'),
            signature: uni.getStorageSync('signature'),
            rawData: uni.getStorageSync('rawData'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          console.log(param.sessionKey)
          console.log(param.signature)
          console.log(param.rawData)
          uni.checkSession({
            success: (res) => {
              console.log('用户在微信的登录状态尚未过期')
              if (param.sessionKey) {
                that.loginBackend(param)
              } else {
                console.log('sessionKey为空')
                this.getSessionKey(param)
              }
            },
            fail: (res) => {
              console.log('用户登录状态已经过期/用户尚未登录')
              uni.login({
                provider: 'weixin',
                success: function (res) {
                  console.log(res.code)
                  that.getRequest('/wx/user/wxf55b5887b136a227/login', {
                    code: res.code
                  }).then(resp => {
                    if (resp) {
                      console.log(resp)
                      uni.setStorageSync('openId', resp.obj.openid)
                      uni.setStorageSync('sessionKey', resp.obj.sessionKey)
                      param.sessionKey = resp.obj.sessionKey
                      setTimeout(that.loginBackend(param), 500)
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                },
                fail: function () {
                  uni.showToast({
                    icon: 'none',
                    title: '登录失败'
                  })
                },
                complete: function () {
                  console.log('完成login')
                }
              })
            }
          })
        } else {
          uni.showToast({
            title: '拒绝授权'
          })
        }
      },
      loginBackend (param) {
        console.log(param)
        this.getRequest('/wx/user/wxf55b5887b136a227/phone', param).then(resp => {
          if (resp && resp.obj) {
            console.log(resp)
            console.log(resp.obj)
            this.userInfo = Object.assign(this.userInfo, resp.obj.user)
            this.roles = resp.obj.user.roles
            this.isAdmin = resp.obj.user.roles.some(item => item.name === 'ROLE_admin')
            console.log(this.userInfo)
            uni.setStorageSync('userInfo', this.userInfo)
            uni.setStorageSync('cookie', resp.obj.cookie)
            uni.setStorageSync('hasLogin', true)
            uni.setStorageSync('role', resp.obj.user.roles)
            this.getRequest('/duty/current').then(resp => {
              if (resp) {
                uni.setStorageSync('currentDuty', resp.obj)
                this.hasLogin = true
              }
            })
            uni.hideLoading()
          } else if (resp) {
            uni.showModal({
              title: '提示',
              content: resp.msg
            })
            uni.hideLoading()
          } else {
            console.log('获取失败')
            this.getSessionKey(param)
          }
        }).catch(error => {
          console.log("登录后台出现错误", error)
          uni.hideLoading()
        })
      },
      getSessionKey (param) {
        const that = this
        uni.login({
          provider: 'weixin',
          success: function (res) {
            console.log(res)
            console.log(res.code)
            that.getRequest('/wx/user/wxf55b5887b136a227/login', {
              code: res.code
            }).then(resp => {
              if (resp) {
                console.log(resp)
                uni.setStorageSync('openId', resp.obj.openid)
                uni.setStorageSync('sessionKey', resp.obj.sessionKey)
                param.sessionKey = resp.obj.sessionKey
                uni.getUserInfo({
                  success: (result) => {
                    uni.setStorageSync('userInfo', result.userInfo)
                    uni.setStorageSync('rawData', result.rawData)
                    uni.setStorageSync('signature', result.signature)
                    that.userInfo = result.userInfo
                    param.rawData = result.rawData
                    param.signature = result.signature
                    that.loginBackend(param)
                  }
                })
              }
            }).catch(error => {
              console.log(error)
            })
          },
          fail: function () {
            uni.showToast({
              icon: 'none',
              title: '微信登录失败'
            })
          }
        })
      },
      getUserInfo () {
        uni.getUserInfo({
          success: (res) => {
            uni.setStorageSync('userInfo', res.userInfo)
            uni.setStorageSync('rawData', res.rawData)
            uni.setStorageSync('signature', res.signature)
          }
        })
      },
      getInfoDetail () {
        console.log('get info detail function')
        uni.navigateTo({
          url: '/pages/userInfo/userInfo'
        })
      },
      getRecordDetail () {
        console.log('get record detail function')
        uni.navigateTo({
          url: '/pages/userRecordList/userRecordList?id=' + this.userInfo.id
        })
      },
      getAllRecord () {
        console.log('get all record (for admin)')
        const currentDuty = uni.getStorageSync('currentDuty') || undefined
        if (currentDuty) {
          uni.navigateTo({
            url: '/pages/currentDutyRecord/currentDutyRecord'
          })
        } else {
          uni.showModal({
            title: '提示',
            content: '当前需要值班的总值信息，无法查看'
          })
        }
      }
    }
  }
</script>

<style>
/*icon图标设置*/
/* @font-face {
  font-family: 'iconfont';
  src: url('/static/icon-font/iconfont.eot');
  src: url('/static/icon-font/iconfont.eot?#iefix') format('embedded-opentype'),
      url('/static/icon-font/iconfont.woff2') format('woff2'),
      url('/static/icon-font/iconfont.woff') format('woff'),
      url('/static/icon-font/iconfont.ttf') format('truetype'),
      url('/static/icon-font/iconfont.svg#iconfont') format('svg');
} */


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
