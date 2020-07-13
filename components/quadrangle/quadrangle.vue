<template>
	<view class="quardrangle" v-if="place.length > 0">
		<uni-grid :column="2">
		  <uni-grid-item v-for="(item, index) in place" :index="index" :key="index">
		  	<view class="grid-item-box" v-if="index === 0 || index === 1">
		  		<text class="text" style="text-align: center;">{{ item.name.substr(3) }}</text>
          <text class="text" v-if="item.isChecked">{{ item.time }}</text>
          <text class="text" v-else style="color: #DD524D; font-size: 60rpx; font-weight: bold;">未打卡</text>
          <view class="icon-image">
            <image v-if="item.isChecked" src="../../static/icon/clock.png"></image>
          </view>
		  	</view>
        <view class="grid-item-box" v-else>
          <view class="icon-image">
            <image v-if="item.isChecked" src="../../static/icon/clock.png"></image>
          </view>
          <text class="text" v-if="item.isChecked">{{ item.time }}</text>
          <text class="text" v-else style="color: #DD524D; font-size: 60rpx; font-weight: bold;">未打卡</text>
          <text class="text" style="text-align: center;">{{ item.name.substr(3) }}</text>
        </view>
		  </uni-grid-item>
		</uni-grid>
    <view class="button-view">
      <button class="my-button" @click="myClick">打卡</button>
    </view>
	</view>
</template>

<script>
	export default {
    props: {
      place: {
        type: Array,
        default () {
        	return []
        }
      }
    },
		data() {
			return {
			};
		},
    methods: {
      myClick () {
        console.log('点击了子组件(四宫格)的打卡按钮')
        this.$emit("punchIn");
      }
    }
	}
</script>

<style>
.quardrangle {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  font-size: 14px;
  background-color: #ffffff;
  width: 602upx;
  height: 602upx;
}

.grid-item-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

image {
  text-align: center;
  width: 80rpx;
  height: 80rpx;
}

.text {
  margin-bottom: 10rpx;
  margin-top: 10rpx;
  font-size: 30rpx;
}

.button-view {
  width: 10upx;
  margin-top: -390upx;
  margin-left: 206upx;
}

.my-button {
  width: 180upx;
  height: 180upx;
  border-radius: 50%;
  background-color: #007AFF;
  color: #FFFFFF;
  font-size: 52upx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4upx 4upx 20upx #A9A9A9;
}
</style>
