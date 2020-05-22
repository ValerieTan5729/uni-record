<template>
  <view class="form">
    <view style="width: 90%;">
      <evan-form :model="record" ref="form" v-model="record">
        <evan-form-item label="总值名称" prop="dutyName">
          <input class="form-input" v-model="record.dutyName" :disabled="true"/>
        </evan-form-item>
        <evan-form-item label="打卡时间" prop="date" v-if="!edit">
          <input class="form-input" v-model="record.date" :disabled="!edit" placeholder-class="form-input-placeholder"/>
        </evan-form-item>
        <evan-form-item label="打卡地点" prop="place">
          <picker class="form-picker"
            :range="placeList" range-key="name" :value="findPlaceIndex()"
            @change="changePlace" :disabled="!edit">
            <view class="uni-input">{{record.placeName}}</view>
          </picker>
        </evan-form-item>
        <evan-form-item label="备注" prop="remark">
          <textarea v-model="record.remark" :disabled="!edit"></textarea>
        </evan-form-item>
        <evan-form-item label="照片" prop="image">
          <image v-if="record.imgPath" class="form-image" mode="aspectFill"
            :src="imgPath + record.imgPath"
            @click="previewImage()" />
        </evan-form-item>
        <button class="send-button" type="primary" v-if="edit" @click="send">保存</button>
      </evan-form>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        record: {
          dutyName: '',
          date: '',
          place: '',
          placeName: null,
          remark: '',
          image: '',
          imgPath: null,
          userId: null,
          dutyId: null
        },
        edit: true,
        placeList: [],
        imgPath: 'http://localhost:2005/mini/wx/img?path=',
        defaultImage: '../../../static/image/camera.png',
        photoPath: null,
        rules: {
          dutyName: {
            required: true
          },
          place: {
            required: true
          },
          date: {
            required: true
          },
          image: {
            required: true
          }
        }
      }
    },
    mounted() {
      this.$refs.form.setRules(this.rules)
    },
    onLoad: function (data) {
      console.log(data)
      this.getRequest('/basic/dic/parent/2').then(resp => {
        console.log(resp.obj)
        this.placeList = resp.obj
        // this.record.placeName = this.findPlaceName()
        console.log('place name is ', this.record.placeName)
      })
      if (data && data.item) {
        console.log(data.edit)
        this.record = JSON.parse(data.item)
        this.edit = data.edit === "1" ? true : false
        console.log(this.record)
        console.log(this.edit)
      }
      console.log(this.record)
    },
    methods: {
      changePlace (e) {
        this.record.place = this.placeList[e.target.value].id
        this.record.placeName = this.findPlaceName()
      },
      findPlaceIndex () {
        if (this.record.place !== '' && this.placeList.length > 0) {
          return this.placeList.findIndex(item => item.id == this.record.place)
        }
        return null
      },
      findPlaceName () {
        const index = this.findPlaceIndex();
        console.log('index = ', index)
        if (index !== null && index !== -1) {
          return this.placeList[index].name
        } else {
          return ''
        }
      },
      previewImage () {
        console.log('preview image')
        let array = []
        array.push(this.imgPath + this.record.imgPath)
        uni.previewImage({
          urls: array
        })
      },
      takePhoto () {
        console.log('take photo')
        const that = this
        uni.chooseImage({
          sourceType: ['camera'],
          sizeType: ['original', 'compressed'],
          success: function (res) {
            console.log(res.tempFilePaths[0]);
            that.photoPath = res.tempFilePaths[0]
          }
        })
      },
      send () {
        console.log('保存打卡记录')
        var that = this
        console.log(this.record)
        this.postRequest('/record/add', this.record).then(resp => {
          if (resp) {
            console.log(resp)
            uni.redirectTo({
              url: '/pages/record/user/user?id=' + this.record.userId
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #FFFFFF;
  }
  .form {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .evan-form-item-container__label {
    min-width: 80px;
    margin-right: 20rpx;
  }
  .form-input {
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    height: 60rpx;
  }
  .form-input-placeholder {
    font-size: 28rpx;
    color: #999;
  }
  .form-picker {
    text-align: left;
    width: 100%;
    box-sizing: border-box;
  }
  .form-image {
    width: 200rpx;
    height: 200rpx;
  }
  .send-button {
    margin-top: 60rpx;
    width: 180rpx;
  }
</style>
