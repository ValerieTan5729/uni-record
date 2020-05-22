<template>
	<view class="form">
    <!--
    <view class="info">
      <view class="item">
        <image :src="userInfo.avatarUrl" style="text-align: center; width: 150upx; height: 150upx; border-radius: 150upx;" />
      </view>
      <view class="center-list">
        <view class="center-list-item border-bottom">
          <text class="list-text">姓名</text>
          <text class="list-content">{{userInfo.name}}</text>
        </view>
        <view class="center-list-item border-bottom">
          <text class="list-text">手机号码</text>
          <text class="list-content">{{userInfo.phone}}</text>
        </view>
        <view class="center-list-item border-bottom">
          <text class="list-text">所属部门</text>
          <text class="list-content">{{userInfo.depName}}</text>
        </view>
        <view class="center-list-item border-bottom">
          <text class="list-text">值班级别</text>
          <text class="list-content">{{userInfo.dutyLevelName}}</text>
        </view>
      </view>
    </view>
    -->
    <evan-form :model="userInfo" style="width: 90%;">
      <evan-form-item prop="avatarUrl" style="display: flex; justify-content: center;">
        <image :src="userInfo.avatarUrl" style="text-align: center; width: 150upx; height: 150upx; border-radius: 150upx; margin: 20px;" />
      </evan-form-item>
      <evan-form-item label="用户名称" prop="name">
        <input class="form-input" v-model="userInfo.name" :disabled="true"/>
      </evan-form-item>
      <evan-form-item label="手机号码" prop="phone">
        <input class="form-input" v-model="userInfo.phone" :disabled="true"/>
      </evan-form-item>
      <evan-form-item label="所属部门" prop="depName">
        <input class="form-input" v-model="userInfo.depName" :disabled="true"/>
      </evan-form-item>
      <evan-form-item label="值班级别" prop="dutyLevelName">
        <input class="form-input" v-model="userInfo.dutyLevelName" :disabled="true"/>
      </evan-form-item>
    </evan-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
    onShow: function () {
      console.log('user info page is show')
      console.log(uni.getStorageSync('userInfo'))
      this.userInfo = uni.getStorageSync('userInfo') || {}
    },
		methods: {
			
		}
	}
</script>

<style>
  .form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .evan-form-item-container__label {
    min-width: 80px;
  }
  .form-input {
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    height: 60rpx;
  }
</style>
