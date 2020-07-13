<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
    const userInfo = uni.getStorageSync('userInfo')
    const sessionKey = uni.getStorageSync('sessionKey')
    const signature = uni.getStorageSync('signature')
    const rawData = uni.getStorageSync('rawData')
    const that = this
    uni.checkSession({
      success: (res) => {
        console.log('用户在微信的登录状态尚未过期')
        /*
        uni.getSetting({
          success: (auth) => {
            if (!auth.authSetting['scope.userInfo']) {
              // 未获取用户信息的权限
              console.log('未获取用户信息的权限 - 跳转获取用户信息的界面')
              uni.reLaunch({
                url: '/pages/login/login'
              })
            } else {
              // 获取用户信息的权限, 检查用户是否登录后台
              this.getRequest('/doLogin').then(resp => {
                if (resp) {
                  console.log(resp)
                  uni.setStorageSync('hasLogin', true)
                }
              }).catch(error => {
                console.log(error)
              })
            }
          }
        })*/
      },
      fail: (res) => {
        console.log('用户登录状态已经过期/用户尚未登录')
        console.log(res)
        that.login()
      }
    })
	},
	onShow: function() {
		console.log('App Show')
    const that = this
    uni.getSetting({
      success: (auth) => {
        if (!auth.authSetting['scope.userInfo']) {
          // 未获取用户信息的权限
          console.log('未获取用户信息的权限 - 跳转获取用户信息的界面')
          uni.reLaunch({
            url: '/pages/login/login'
          })
        } else {
          that.getUserInfo()
          // 获取用户信息的权限, 检查用户是否登录后台
          this.getRequest('/doLogin').then(resp => {
            if (resp) {
              console.log(resp)
              uni.setStorageSync('hasLogin', true)
              that.getUserInfo(resp.obj)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
    })
	},
	onHide: function() {
		console.log('App Hide')
    uni.setStorageSync('leftTime', )
	},
  methods: {
    login () {
      console.log('login method')
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
    },
    getUserInfo (data) {
      console.log('get user info')
      uni.getUserInfo({
        success: (res) => {
          console.log('get user info success')
          console.log(res.userInfo)
          uni.setStorageSync('rawData', res.rawData)
          uni.setStorageSync('signature', res.signature)
          if (data) {
            uni.setStorageSync('userInfo', Object.assign(res.userInfo, data))
          } else {
            uni.setStorageSync('userInfo', res.userInfo)
          }
        }
      })
    }
  }
};
</script>

<style>
  
  @font-face {
    font-family: 'iconfont';  /* project id 1919523 */
    src: url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.eot');
    src: url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.woff') format('woff'),
    url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1919523_rrpb0sxgumb.svg#iconfont') format('svg');
  }
  
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
