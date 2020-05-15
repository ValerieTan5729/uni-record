<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
    let userInfo = uni.getStorageSync('userInfo') || ''
    const that = this
    uni.checkSession({
      success: (res) => {
        console.log('用户登录状态尚未过期')
        console.log(res)
        uni.getSetting({
          success: (res) => {
            console.log(res)
            console.log(res.authSetting['scope.camera'])
            if (!res.authSetting['scope.camera']) {
              // 未获取用户摄像头的权限
            }
          }
        })
      },
      fail: (res) => {
        console.log('用户登录状态已经过期/用户尚未登录')
        console.log(res)
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
                uni.setStorageSync('openId', resp.openid)
                uni.setStorageSync('sessionKey', resp.sessionKey)
                uni.getSetting({
                  success: (res) => {
                    if (!res.authSetting['scope.userInfo']) {
                      // 未获取用户信息的权限
                      uni.reLaunch({
                        url: '/pages/login/login'
                      })
                    }
                  }
                })
              }
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
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
page {
  background-color: #F5F5F5;
}
</style>
