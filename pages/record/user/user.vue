<template>
  <view>
    <uni-list v-for="(item, index) in records" :key="item.id">
      <uni-list-item 
        :title="item.dutyName" :note="item.date"
        @click="getRecordDetail(item)"/>
    </uni-list>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        records: [],
        page: 1,
        total: 0,
        userId: undefined,
        recordId: undefined
      }
    },
    onLoad: function (data) {
      if (data && data.id) {
        this.userId = data.id
        this.getRecordList()
      }
    },
    onShow: function () {},
    onReachBottom: function () {
      if (this.total > this.records.length) {
        this.getRecordList()
      } else {
        uni.showToast({
          title: '没有更多数据了',
          icon: 'none'
        })
      }
    },
    methods: {
      getRecordList () {
        const url = '/record/?page=' + this.page + '&limit=10&userId=' + this.userId + '&sortby=date&order=descending'
        this.getRequest(url).then(resp => {
          if (resp) {
            this.total = resp.obj.total
            this.records = this.records.concat(resp.obj.data)
            this.page += 1
          }
        })
      },
      getRecordDetail (res) {
        console.log('get record detail function', res)
        uni.navigateTo({
          url: '/pages/record/detail/detail?&item=' + JSON.stringify(res)
        })
      }
    }
  }
</script>

<style>
</style>
