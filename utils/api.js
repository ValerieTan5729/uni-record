import Request from '@/js_sdk/luch-request/luch-request/index.js'

const http = new Request();

http.interceptor.response((success) => {
  console.log('返回进入拦截成功')
  if (success.status && success.status === 200 && success.data.status === 500) {
    console.log(success.data.msg)
    uni.showModal({
      title: '错误信息',
      content: success.data.msg
    })
    return
  }
  if (success.data.msg) {
    // Message.success({ message: success.data.msg, duration: 1500 })
    console.log(success.data.msg)
    /*
    uni.showToast({
      title: success.data.msg
    })*/
  }
  return success.data
  // return Promise.resolve(success.data)
}, (error) => {
  console.log('返回进入拦截失败')
  console.log(error)
  console.log(error.statusCode)
  // return Promise.reject(error)
  if (error.statusCode === 504 || error.statusCode === 404) {
    // Message.error({ message: '服务器被吃了( ╯□╰ )' })
    console.log('服务器被吃了( ╯□╰ )')
    uni.showModal({
      title: '错误信息',
      content: '服务器被吃了( ╯□╰ )'
    })
  } else if (error.statusCode === 403) {
    // Message.error({ message: '权限不足，请联系管理员' })
    console.log('权限不足，请联系管理员')
    uni.showModal({
      title: '错误信息',
      content: '权限不足，请联系管理员'
    })
  } else if (error.statusCode === 401) {
    // Message.error({ message: '尚未登录，请登录' })
    console.log('尚未登录，请登录')
    uni.showModal({
      title: '错误信息',
      content: '尚未登录，请登录',
      complete: () => {
        console.log('跳转登录页面')
        let userInfo = uni.getStorageSync('userInfo')
        userInfo.phone = undefined
        uni.setStorageSync('hasLogin', false)
        uni.reLaunch({
          url: '/pages/blank/blank'
        })
      }
    })
  } else {
    if (error.data.msg) {
      // Message.error({ message: error.data.msg })
      console.log(error.data.msg)
      uni.showModal({
        title: '错误信息',
        content: error.data.msg
      })
    } else {
      // Message.error({ message: '未知错误!' })
      console.log('未知错误!')
      uni.showModal({
        title: '错误信息',
        content: '未知错误!'
      })
    }
  }
})

const base = 'http://localhost:2005/mini'


const getRequest = (url, params, cookie) => {
  console.log('get request')
  console.log(cookie)
  let header = {}
  if (cookie) {
    header.cookie = 'JSESSIONID=' + cookie
    header.message = 'requestwithcookie'
  }
  return http.request({
    header: header,
    method: 'GET',
    url: `${base}${url}`,
    data: params
  })
}

export default getRequest