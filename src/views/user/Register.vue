<template>
  <div style="height: 100%; background: #F0F8FF;">
    <ValidationObserver
        ref="obs"
        v-slot="{ validated }"
    >
      <v-card
          width="350px"
          class="mx-auto"
          style="top: 20%;"
      >
        <v-toolbar class="font-weight-bold" dense dark flat color="light-blue lighten-1" >Bookmark Tomb</v-toolbar>
        <v-card-title></v-card-title>
        <v-card-text>
          <VTextFieldWithValidation
              :validated="validated"
              v-model="registerInfo.username"
              rules="required"
              :placeholder="$t('login.username')"
              icon="mdi-account-outline"
          />
          <VTextFieldWithValidation
              :validated="validated"
              v-model="registerInfo.email"
              rules="required|email"
              :placeholder="$t('login.email')"
              icon="mdi-email-outline"
          />
          <VTextFieldWithValidation
              :validated="validated"
              v-model="registerInfo.code"
              rules="required"
              placeholder="邮箱验证码"
              :loading="appendIconLoading"
              appendIcon="mdi-email-send-outline"
              @appendIconFun="getEmailVerifyCode"
              icon="mdi-shield-check-outline"
          />
          <VTextFieldWithValidation
              :validated="validated"
              v-model="registerInfo.password"
              rules="required"
              vid="password"
              :placeholder="$t('login.pwd')"
              type="password"
              icon="mdi-lock-outline"
          />

          <VTextFieldWithValidation
              :validated="validated"
              v-model="confirmPassword"
              rules="required|confirmed:password"
              :placeholder="$t('login.confirmPwd')"
              type="password"
              icon="mdi-lock-outline"
              @keyup.enter="register"
          />

          <router-link to="login" class="text-decoration-none">
            <span style="font-size: 13px;">{{ $t('login.alreadyRegister') }}</span>
          </router-link>
        </v-card-text>
        <v-card-actions>
          <v-btn
              class="mx-auto"
              color="blue"
              outlined
              rounded
              dark
              width="150"
              @click="register"
          >{{ $t('login.register') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
  },

  data: () => ({
    formValidate: false,
    confirmPassword: "",
    registerInfo: {
      code: "",
      username: "",
      email: "",
      password: ""
    },
    snackbar: false,
    snackColor: "",
    snackbarText: "",
    appendIconLoading: false
  }),

  methods: {
    register() {
      this.$refs.obs.validate().then(res => {
        this.formValidate = res
        if (this.formValidate) {
          this.registerInfo.code = this.registerInfo.code.toLowerCase()
          this.$store.dispatch('userRegister', this.registerInfo).then(() => {
            this.snackColor = 'success'
            this.snackbarText = this.$t('register.registerSuccess')
            this.snackbar = true
            setTimeout(this.toLogin, 2000)
          }).catch(error => {
            if (error.response.data.code === 4105) {
              this.snackColor = 'error'
              this.snackbarText = this.$t('register.emailRegistered')
              this.snackbar = true
            }
          })
        }
      })
    },
    toLogin() {
      this.$router.push('/login')
    },
    getEmailVerifyCode() {
      this.appendIconLoading = true
      this.$store.dispatch('getEmailVerifyCode', this.registerInfo.email).then(() => {
        this.emailLoading = false
        this.snackColor = 'success'
        this.snackbarText = this.$t('security.sendSuccess')
        this.snackbar = true
        this.appendIconLoading = false
      }).catch(() => {
        this.emailLoading = false
        this.snackColor = 'error'
        this.snackbarText = this.$t('security.sendError')
        this.snackbar = true
        this.appendIconLoading = false
      })
    },
  },
};
</script>
