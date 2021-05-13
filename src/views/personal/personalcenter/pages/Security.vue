<template>
  <div style="padding-top: 100px;">
    <v-card class="mx-auto" max-width="450" height="350">
      <v-tabs :color="systemColor">
        <v-tab style="width: 50%">{{ $t('security.changePasswd') }}</v-tab>
        <v-tab style="width: 50%">{{ $t('security.changeEmail') }}</v-tab>

        <v-tab-item>
          <v-container class="mt-4">
            <v-form>
              <v-row
                  v-for="item in resetPwdData"
                  :key="item.name"
                  align="center"
                  justify="center"
                  no-gutters
              >
                <v-col cols="4" style="text-align: end;">
                  <p>{{ item.name }}</p>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      :color="systemColor"
                      class="ml-1"
                      v-model="item.model"
                      dense
                  />
                </v-col>
              </v-row>
              <v-row
                  align="center"
                  justify="center"
              >
                <v-col style="text-align: center;" class="mt-4">
                  <v-btn
                      outlined
                      rounded
                      :color="systemColor"
                      width="100"
                      :loading="resetPwdloading"
                      @click="resetUserPwd"
                  >{{ $t('security.confirm') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tab-item>

        <v-tab-item>
          <v-container class="mt-4">
            <v-form>
              <v-row
                  v-for="(item, index) in resetEmailData"
                  :key="item.name"
                  align="center"
                  justify="center"
                  no-gutters
              >
                <v-col cols="4" style="text-align: end;">
                  <p>{{ item.name }}</p>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      :color="systemColor"
                      class="ml-1"
                      v-model="item.model"
                      :append-icon="index === 2 ? 'mdi-email-send-outline' : ''"
                      dense
                  >
                    <template v-slot:append="">
                      <v-btn
                          v-show="index === 2"
                          icon
                          :loading="emailLoading"
                      >
                        <v-icon
                            :color="systemColor"
                            @click="getEmailVerifyCode"
                        >mdi-email-send-outline
                        </v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row
                  no-gutters
                  align="center"
                  justify="center"
              >
                <v-col style="text-align: center;" class="mt-4">
                  <v-btn
                      outlined
                      rounded
                      :color="systemColor"
                      width="100"
                      @click="resetUserEmail"
                      :loading="resetEmailLoading"
                  >{{ $t('security.confirm') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import {removeToken} from '@/lib/storage/token'
import {mapGetters} from "vuex";

export default {
  data: () => ({
    resetPwdloading: false,
    resetEmailLoading: false,
    emailLoading: false,
    resetPwdParam: {
      oldPassword: '',
      password: ''
    },
    resetEmailParam: {
      code: '',
      email: '',
      password: ''
    },


    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  computed: {
    ...mapGetters(['systemColor']),
    resetPwdData() {
      return [
        {name: this.$t('security.oldPasswd'), model: ''},
        {name: this.$t('security.newPasswd'), model: ''},
        {name: this.$t('security.confirmPasswd'), model: ''}
      ]
    },
    resetEmailData() {
      return [
        {name: this.$t('security.newEmail'), model: ''},
        {name: this.$t('security.passwd'), model: ''},
        {name: this.$t('security.code'), model: ''}
      ]
    }
  },

  methods: {
    resetUserPwd() {
      this.resetPwdloading = true
      this.resetPwdParam.oldPassword = this.resetPwdData[0].model
      this.resetPwdParam.password = this.resetPwdData[1].model
      this.$store.dispatch('resetUserPwd', this.resetPwdParam).then(() => {
        removeToken()
        this.snackColor = 'success'
        this.snackbarText = this.$t('security.changeSuccess')
        this.snackbar = true
        this.$router.push('/login')
      }).catch(() => {
        this.resetPwdloading = false
        this.snackColor = 'error'
        this.snackbarText = this.$t('security.changeSuccess')
        this.snackbar = true
      })
    },
    getEmailVerifyCode() {
      this.emailLoading = true
      this.$store.dispatch('getEmailVerifyCode', this.resetEmailData[0].model).then(() => {
        this.emailLoading = false
        this.snackColor = 'success'
        this.snackbarText = this.$t('security.sendSuccess')
        this.snackbar = true
      }).catch(() => {
        this.emailLoading = false
        this.snackColor = 'error'
        this.snackbarText = this.$t('security.sendError')
        this.snackbar = true
      })
    },
    resetUserEmail() {
      this.resetEmailLoading = true
      this.resetEmailParam.code = this.resetEmailData[2].model.toLowerCase()
      this.resetEmailParam.email = this.resetEmailData[0].model
      this.resetEmailParam.password = this.resetEmailData[1].model
      this.$store.dispatch('resetUserEmail', this.resetEmailParam).then(() => {
        removeToken()
        this.snackColor = 'success'
        this.snackbarText = this.$t('security.changeSuccess')
        this.snackbar = true
        this.$router.push('/login')
      }).catch(() => {
        this.resetEmailLoading = false
        this.snackColor = 'error'
        this.snackbarText = this.$t('security.changeSuccess')
        this.snackbar = true
      })
    }
  }
}
</script>