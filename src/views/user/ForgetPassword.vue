<template>
  <div style="height: 100%; background: #F0F8FF;">
    <v-card width="450" class="mx-auto" style="top: 20%">
      <v-card-title>
        <router-link to="/login" style="text-decoration:none; color: #808080; font-size: 14px;">
          <v-icon class="mt-n1">
            mdi-chevron-left
          </v-icon>
          <span style="margin-left: -5px;">{{ $t('appBar.back') }}</span>
        </router-link>
      </v-card-title>
      <v-card-text>
        <validation-observer
            ref="forgetPasswd"
            v-slot="{ validated }"
        >
          <v-row
              justify="center"
              no-gutters
          >
            <v-col :cols="cols">
              <v-text-field-with-validation
                  :validated="validated"
                  rules="required|email"
                  :placeholder="$t('forgetPasswd.email')"
                  v-model="forgetPasswdParam.email"
                  icon="mdi-email-outline"
              />
            </v-col>
          </v-row>
          <v-row
              align="center"
              justify="center"
              no-gutters
          >
            <v-col :cols="cols">
              <v-text-field-with-validation
                  :validated="validated"
                  rules="required"
                  :placeholder="$t('forgetPasswd.code')"
                  :loading="appendIconLoading"
                  appendIcon="mdi-email-send-outline"
                  @appendIconFun="getEmailVerifyCode"
                  v-model="forgetPasswdParam.code"
                  icon="mdi-shield-check-outline"
              />
            </v-col>
          </v-row>
          <v-row
              align="center"
              justify="center"
              no-gutters
          >
            <v-col :cols="cols">
              <v-text-field-with-validation
                  :validated="validated"
                  rules="required"
                  type="password"
                  vid="password"
                  :placeholder="$t('forgetPasswd.newPasswd')"
                  v-model="forgetPasswdParam.password"
                  icon="mdi-lock-outline"
              />
            </v-col>
          </v-row>
          <v-row
              align="center"
              justify="center"
              no-gutters
          >
            <v-col :cols="cols">
              <v-text-field-with-validation
                  :validated="validated"
                  rules="required|confirmed:password"
                  type="password"
                  :placeholder="$t('forgetPasswd.confirm')"
                  v-model="confirmPass"
                  icon="mdi-lock-outline"
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn
                color="blue"
                class="mx-auto"
                width="150"
                outlined
                rounded
                @click="forgetPasswd"
            >
              {{ $t('forgetPasswd.change')}}
            </v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card-text>
    </v-card>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{snackbarText}}
    </v-snackbar>
  </div>
</template>

<script>
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";
import {forgetPasswd} from "@/api/user";
export default {
  name: "ForgetPassword",

  components: {
    ValidationObserver,
    VTextFieldWithValidation
  },

  data: () => ({
    cols: 8,
    forgetPasswdParam: {
      email: "",
      password: "",
      code: ""
    },
    confirmPass: "",
    snackbar: false,
    snackColor: "",
    snackbarText: "",
    appendIconLoading: false
  }),

  methods: {
    getEmailVerifyCode() {
      this.appendIconLoading = true
      this.$store.dispatch('getEmailVerifyCode', this.forgetPasswdParam.email).then(() => {
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
        this.appendIconLoading =false
      })
    },
    forgetPasswd() {
      this.forgetPasswdParam.code = this.forgetPasswdParam.code.toLowerCase()
      this.$refs.forgetPasswd.validate().then(isValidate => {
        if(isValidate) {
          forgetPasswd(this.forgetPasswdParam).then(() => {
            this.emailLoading = false
            this.snackColor = 'success'
            this.snackbarText = this.$t('security.changeSuccess')
            this.snackbar = true
            setTimeout(this.toLogin,2000)
          }).catch(() => {
            this.emailLoading = false
            this.snackColor = 'error'
            this.snackbarText = this.$t('security.changeError')
            this.snackbar = true
          })
        }
      })
    },
    toLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
