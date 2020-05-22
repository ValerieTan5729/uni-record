<template>
	<view class="page">
    <view>
      <view class="duty-info">
        <text v-if="duty.name === undefined">当前没有需要打卡的值班</text>
        <text v-else>{{duty.name}}</text>
      </view>
      <button class="timeButton" @click="punchIn">{{time}}</button>
    </view>
	</view>
</template>

<script>
import { formateDate } from '../../utils/util.js'
export default {
  data() {
    return {
      duty: {},
      time: formateDate(new Date(), 'h:min:s')
    }
  },
  onLoad () {
    this.getRequest('/duty/current').then(resp => {
      if (resp) {
        console.log(resp)
        if (resp.obj === null) {
          uni.showModal({
            title: '提示',
            content: resp.msg
          })
        } else {
          this.duty = resp.obj
        }
      }
    }).catch(err => {
      console.log(err)
    })
    this.getTime()
  },
  onShow () {},
  methods: {
    getTime () {
      var that = this
      setInterval(() => {
        that.time = formateDate(new Date(), 'h:min:s')
      }, 1000)
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
                  userId: uni.getStorageSync('userInfo').id,
                  imgPath: resp.obj.imgUrl,
                  place: resp.obj.place
                }
                uni.navigateTo({
                  url: 'detail/detail?edit=1&item=' + JSON.stringify(record)
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 1000rpx;
}
.duty-info {
  margin-bottom: 60rpx;
  margin-top: 60rpx;
  font-size: 60rpx;
  text-align: center;
}
.timeButton {
  width: 300rpx;
  height: 300rpx;
  border-radius: 400rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4169E1;
  color: #FFFFFF;
  font-size: 60rpx;
}
</style>
