<template>
	<view>
		<uni-steps :options="step" direction="column" :myStyle="1"></uni-steps>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				step: [
          {
            title: '开始打卡',
            desc: '点击页面中的"打卡"按钮'
          },
          {
            title: '进行拍照',
            desc: '使用摄像头对地点的二维码进行拍照'
          },
          {
            title: '填写情况',
            desc: '拍照过后, 在打卡详情页面填写打卡地点的情况'
          },
          {
            title: '结束打卡',
            desc: '点击详情页面的"保存"按钮, 完成打卡'
          }
        ],
        style: 'number'
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
