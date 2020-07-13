<template>
	<view class="page">
	  <view class="timeInfo">
	    <view class="timeView">
	      <text>{{time}}</text>
	    </view>
	    <view class="info">
	      <view class="dateView">
	        <text>{{date}}</text>
	      </view>
	      <view class="weekView">
	        <text>{{week}}</text>
	      </view>
	    </view>
	  </view>
	  <view class="myButton">
	    <button class="record" style="width: 200rpx;" @click="getRecordList">
	      <text class="icon">&#xe603;</text> 打卡记录
	    </button>
	    <button class="rule" style="width: 160rpx;" @click="toRulePage"> 
	      <text class="icon">&#xe6cd;</text> 规则
	    </button>
	  </view>
	  <view class="dutyInfo">
	    <text v-if="duty.name === undefined">当前没有需要打卡的值班</text>
	    <text v-else>{{duty.name}}</text>
	  </view>
	  <view class="main">
	    <quadrangle :place="place" v-on:punchIn="punchIn" />
	  </view>
	</view>
</template>

<script>
  // 媒体港打卡页面
import { formateDate } from '../../utils/util.js'
export default {
  data() {
    return {
      duty: {},
      place: [],
      time: formateDate(new Date(), 'h:min:s'),
      date: formateDate(new Date(), 'MD'),
      week: formateDate(new Date(), 'week')
    }
  },
  onLoad () {
    this.getTime()
  },
  onShow () {
    this.duty = uni.getStorageSync('currentDuty') || {}
    const cookie = uni.getStorageSync('cookie') || undefined
    const userId = uni.getStorageSync('userInfo').id
    console.log('record page on show, id is ' + this.duty.id)
    console.log('condition:' + (!this.duty.id && cookie))
    // debugger
    if (!this.duty.id && cookie) {
      this.getRequest('/duty/current').then(resp => {
        if (resp) {
          uni.setStorageSync('currentDuty', resp.obj)
          if (!resp.obj.id) {
            this.duty = resp.obj
            this.getRecord(userId, this.duty.id)
          } else {
            uni.showModal({
              title: '提示',
              content: '当前没有需要值班的总值'
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    } else {
      this.getRecord(userId, this.duty.id)
    }
  },
  onPullDownRefresh () {
    console.log('refresh')
    const userId = uni.getStorageSync('userInfo').id
    uni.showLoading({
        title: '更新总值信息'
    });
    this.getRequest('/duty/current').then(resp => {
      if (resp) {
        console.log(resp.obj)
        uni.setStorageSync('currentDuty', resp.obj)
        if (resp.obj.id) {
          this.duty = resp.obj
          this.getRecord(userId, resp.obj.id)
        } else {
          uni.showModal({
            title: '提示',
            content: '当前没有需要值班的总值'
          })
        }
        uni.hideLoading()
        uni.stopPullDownRefresh()
      }
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    getTime () {
      var that = this
      setInterval(() => {
        that.time = formateDate(new Date(), 'h:min:s')
      }, 1000)
    },
    getRecord (userId, dutyId) {
      const url = '/record/check/0?userId=' + userId + '&dutyId=' + dutyId
      this.getRequest(url).then(resp => {
        if (resp) {
          console.log(resp.obj)
          this.place = resp.obj
        }
      }).catch(error => {
        console.log(error)
      })
    },
    punchIn () {
      console.log('点击了打卡按钮')
      if (this.duty.name === undefined) {
        uni.showModal({
          title: '提示',
          content: '当前无需打卡'
        })
      } else {
        var that = this
        uni.chooseImage({
          sourceType: ['camera'],
          sizeType: ['original', 'compressed'],
          success: function (res) {
            console.log(res.tempFilePaths[0])
            that.uploadRequest('/wx/wxf55b5887b136a227/scan', res.tempFilePaths[0]).then(resp => {
              if (resp) {
                console.log(resp.obj.imgUrl)
                const imgPath = resp.obj.imgUrl
                const placeName = resp.obj.place
                const record = {
                  dutyName: that.duty.name,
                  dutyId: that.duty.id,
                  // userId: uni.getStorageSync('userInfo').id,
                  imgPath: resp.obj.imgUrl,
                  place: resp.obj.place,
                  remark: '正常'
                }
                uni.navigateTo({
                  url: '/pages/recordDetail/recordDetail?edit=1&item=' + JSON.stringify(record)
                })
              }
            })
          }
        })
      }
    },
    getRecordList () {
      const userId = uni.getStorageSync('userInfo').id
      if (userId) {
        uni.navigateTo({
          url: '/pages/userRecordList/userRecordList?id=' + userId
        })
      } else {
        console.log('获取不到用户ID, 无法跳转')
      }
    },
    toRulePage () {
      uni.navigateTo({
        url: '/pages/rule/rule'
      })
    }
  }
}
</script>

<style>
  
  page {
    background-color: #F7F6F6;
  }
  
  .page {
  	display: flex;
  	flex-direction: column;
  	box-sizing: border-box;
  	min-height: 100%;
  	height: auto;
  }
  
  .timeInfo {
    display: flex;
    flex-direction: row;
    margin-top: 20rpx;
  }
  
  .info {
    margin-top: 10rpx;
  }
  
  .dateView{
    margin-top: 10rpx;
    font-size: 40rpx;
  }
  
  .timeView {
    font-size: 100upx;
    margin-left: 10rpx;
    margin-right: 40rpx;
    width: 420rpx;
  }
  
  .myButton {
    display: flex;
    flex-direction: row;
    width: 360rpx;
  }
  
  .record, .rule {
    font-size: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #FFFFFF;
    border-radius: 60rpx;
    padding: 0;
    margin-left: 20rpx;
  }
  
  .record::after, .rule::after {
    border: 1upx #FFFFFF;
  }
  
  .dutyInfo {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: 20rpx;
    font-size: 50rpx;
    line-height: 100rpx;
  }
  
  .main {
    display: flex;
    flex: 1;
    align-content: center;
    justify-content: center;
    margin-top: 10rpx;
  }
  
  .icon {
    font-family: iconfont;
    font-size: 32rpx;
    margin-right: 10rpx;
    line-height: 40rpx;
    color: #0092FF;
  }
</style>
