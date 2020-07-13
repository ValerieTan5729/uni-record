<template>
  <view>
    <uni-list v-for="(item, index) in records" :key="item.id">
      <uni-list-item 
        :title="item.dutyName + '-' + item.userName" :note="item.date + '  ' + item.placeName"
        @click="getRecordDetail(item)"/>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentDuty: {},
      records: [],
      total: 0,
      page: 1
    }
  },
  onLoad (data) {
    console.log('管理员当前值班表的打卡记录页面onLoad')
    this.currentDuty = uni.getStorageSync('currentDuty') || {}
    this.getRecordOfCurrentDuty(this.currentDuty.id)
  },
  onShow () {},
  onReachBottom () {
    if (this.total > this.records.length) {
      this.getRecordOfCurrentDuty(this.currentDuty.id)
    } else {
      uni.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
  },
  methods: {
    getRecordOfCurrentDuty (id) {
      if (id) {
        const url = '/record/?page=' + this.page + '&limit=20&dutyId=' + id + '&sortby=date&order=descending'
        this.getRequest(url).then(resp => {
          if (resp) {
            this.total = resp.obj.total
            this.records = this.records.concat(resp.obj.data)
            this.page += 1
          }
        })
      }
    },
    getRecordDetail (res) {
      console.log('get record detail function', res)
      uni.navigateTo({
        url: '/pages/recordDetail/recordDetail?type=1&item=' + JSON.stringify(res)
      })
    }
  }
}
</script>

<style>

</style>
