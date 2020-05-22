import Request from '@/js_sdk/luch-request/luch-request/index.js'

const http = new Request();

http.interceptor.response((success) => {
  console.log('返回进入拦截成功')
  if (success.statusCode && success.statusCode === 200 && success.data.status === 500) {
    console.log(success.data.msg)
    uni.showModal({
      title: '错误信息',
      content: success.data.msg
    })
    return
  }
  if (success.data.msg) {
    console.log(success.data.msg)
  }
  return success.data
}, (error) => {
  console.log('返回进入拦截失败')
  console.log(error)
  console.log(error.statusCode)
  if (error.statusCode === 504 || error.statusCode === 404) {
    console.log('服务器被吃了( ╯□╰ )')
    uni.showModal({
      title: '错误信息',
      content: '服务器被吃了( ╯□╰ )'
    })
  } else if (error.statusCode === 403) {
    console.log('权限不足，请联系管理员')
    uni.showModal({
      title: '错误信息',
      content: '权限不足，请联系管理员'
    })
  } else if (error.statusCode === 401) {
    console.log('尚未登录，请登录')
    uni.showModal({
      title: '错误信息',
      content: '尚未登录，请登录',
      complete: () => {
        console.log('跳转登录页面')
        let userInfo = uni.getStorageSync('userInfo') || {}
        userInfo.phone = undefined
        uni.setStorageSync('hasLogin', false)
        uni.reLaunch({
          url: '/pages/blank/blank'
        })
      }
    })
  } else {
    if (error.data.msg) {
      console.log(error.data.msg)
      uni.showModal({
        title: '错误信息',
        content: error.data.msg
      })
    } else {
      console.log('未知错误!')
      uni.showModal({
        title: '错误信息',
        content: '未知错误!'
      })
    }
  }
})

const base = 'http://localhost:2005/mini'


export const getRequest = (url, params) => {
  console.log('get request')
  const cookie = uni.getStorageSync('cookie') || undefined
  console.log(cookie)
  let header = {}
  if (cookie) {
    header.cookie = 'JSESSIONID=' + cookie
    header.message = 'getrequestwithcookie'
  }
  return http.request({
    header: header,
    method: 'GET',
    url: `${base}${url}`,
    data: params
  })
}

export const postRequest = (url, params) => {
  console.log('post request')
  const cookie = uni.getStorageSync('cookie') || undefined
  console.log(cookie)
  let header = {}
  if (cookie) {
    header.cookie = 'JSESSIONID=' + cookie
    header.message = 'postrequestwithcookie'
  }
  return http.request({
    header: header,
    method: 'POST',
    url: `${base}${url}`,
    data: params
  })
}

export const uploadRequest = (url, path, params) => {
  console.log('upload request')
  console.log(url)
  console.log(path)
  console.log(params)
  return http.upload(`${base}${url}`, {
    fileType: 'image',
    filePath: path,
    name: 'img',
    formData: params
  })
}