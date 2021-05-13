<template>
  <div style="padding-top: 100px;">
    <v-card class="mx-auto" max-width="450">
      <v-card-actions>
        <v-file-input
            style="display: none"
            ref="input"
            type="file"
            accept="image/*"
            @change="changeAvatar2()"
        />
        <v-avatar size="88" class="mx-auto mt-2" :color="systemColor" @click="changeAvatar()">
          <v-img
              v-if="userAvatar"
              :src="userAvatar"
              :alt="username"
          />
          <span v-else class="white--text">{{ $t('myinfo.avatar') }}</span>
        </v-avatar>
      </v-card-actions>
      <v-card-text>
        <v-container>
          <v-form>
            <v-row
                v-for="item in myInfo"
                :key="item.name"
                align="center"
                justify="center"
                no-gutters
            >
              <v-col cols="3" style="text-align: end;">
                <p>{{ item.name }}</p>
              </v-col>
              <v-col cols="6">
                <v-text-field
                    :color="systemColor"
                    class="ml-1"
                    v-model="item.model"
                    :disabled="item.disabled"
                    dense
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
          <v-btn
              style="margin-left: 25%"
              outlined
              rounded
              :color="systemColor"
              width="100"
              :loading="setUserNickNameLoading"
              @click="setNickname"
          >{{ $t('myinfo.save') }}
          </v-btn>
          <v-btn
              outlined
              rounded
              color="error"
              width="100"
              :loading="logoffLoading"
              @click="logoff"
          >{{ $t('myinfo.logoff') }}
          </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="cropperDialog" width="510">
      <v-card>
        <div style="height: 400px;">
          <vueCropper
              ref="cropper"
              :fixed="option.fixed"
              :centerBox="option.centerBox"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
              :maxImgSize="option.maxImgSize"
              :autoCrop="option.autoCrop"
              :canMove="option.canMove"
          ></vueCropper>
        </div>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              depressed
              dark
              color="primary"
              :loading="setAvatarLoading"
              @click="finish()"
          >保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm-dialog
        :dialog="logoffDialog"
        :dialogText="logoffDialogText"
        @close="logoffDialog = $event"
        @funConfirm="logoffConfirm"
    />
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import {VueCropper} from 'vue-cropper'
import {mapGetters} from 'vuex'
import {logoff} from "@/api/user";
import {removeToken} from "@/lib/storage/token";
import ConfirmDialog from "@/views/components/ConfirmDialog";

export default {
  components: {
    VueCropper,
    ConfirmDialog
  },
  data: () => ({
    logoffDialog: false,
    logoffDialogText: '',
    setUserNickNameLoading: false,
    logoffLoading: false,
    setAvatarLoading: false,
    cropperDialog: false,
    modelAvatar: '',
    setUserNicknameParam: {
      nickname: '',
    },
    option: {
      img: '', //裁剪图片的地址
      size: 0.5, //裁剪生成图片的质量
      fixed: true,
      centerBox: true,
      autoCrop: true,
      outputType: 'jpeg', //裁剪生成图片的格式
      maxImgSize: 500, //限制图片最大宽度和高度
      canMove: false //图片是否可以被拖动
    },
    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  computed: {
    ...mapGetters(['username', 'nickname', 'email', 'userAvatar', 'systemColor']),
    myInfo() {
      return [
        {name: this.$t('myinfo.nickname'), disabled: false, model: this.nickname},
        {name: this.$t('myinfo.username'), disabled: true, model: this.username},
        {name: this.$t('myinfo.email'), disabled: true, model: this.email}
      ]
    }
  },

  created() {
    // this.$store.dispatch('getUserAvatar')
  },

  methods: {
    setNickname() {
      this.setUserNickNameLoading = true
      this.setUserNicknameParam.nickname = this.myInfo[0].model
      this.$store.dispatch('setUserComInfo', this.setUserNicknameParam).then(() => {
        this.setUserNickNameLoading = false
        this.snackColor = 'success'
        this.snackbarText = '信息修改成功'
        this.snackbar = true
      }).catch(() => {
        this.setUserNickNameLoading = false
      })
    },
    changeAvatar() {
      this.$refs.input.$refs.input.click()
    },
    changeAvatar2() {
      this.cropperDialog = true
      this.option.img = ''
      var file = event.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(event.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        data = e.target.result
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.option.img = data
      }
      reader.readAsArrayBuffer(file)
    },
    finish() {
      this.$refs.cropper.getCropData((data) => {
        const file = new window.File([data], 'avatar', {type: 'image/jpeg'})
        const formData = new FormData();
        formData.append('file', file)
        let object = {};
        object = {
          formData: formData,
          data: data,
        }
        this.setAvatarLoading = true
        this.$store.dispatch('setUserAvatar', object).then(() => {
          this.cropperDialog = false
          this.setAvatarLoading = false
        })
      })
    },
    async logoff() {
      this.logoffDialog = true
      this.logoffDialogText = '注销账号之后本账号将不再可用！可在十五天之内联系管理员恢复。'
    },
    async logoffConfirm() {
      this.logoffLoading = true
      await logoff()
      this.snackbarText = '账号已注销！'
      this.snackbar = true
      await removeToken()
      await this.$router.push('/login')
      this.logoffLoading = false
    }
  }
}
</script>