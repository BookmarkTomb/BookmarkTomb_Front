<template>
  <div style="height: 100%; background: #F0F8FF;">
    <ValidationObserver
        ref="obs"
        v-slot="{ validated }"
        @submit.prevent="login()"
    >
      <v-card
          width="400px"
          class="mx-auto"
          style="top: 20%"
      >
        <v-toolbar class="font-weight-bold" dense dark flat color="light-blue lighten-1" >Bookmark Tomb</v-toolbar>
        <v-card-title></v-card-title>
        <v-card-text>
          <VTextFieldWithValidation
              :validated="validated"
              v-model="loginInfo.account"
              rules="required"
              :placeholder="$t('login.username')"
              icon="mdi-account-outline"
          />
          <VTextFieldWithValidation
              :validated="validated"
              v-model="loginInfo.password"
              rules="required"
              :placeholder="$t('login.pwd')"
              type="password"
              icon="mdi-lock-outline"
          />

          <div
              style="display: flex;
            display: -webkit-flex;
            align-items:center;
            justify-content:center;"
          >
            <VTextFieldWithValidation
                :validated="validated"
                v-model="loginInfo.code"
                rules="required"
                :placeholder="$t('login.verifyCode')"
                icon="mdi-shield-check-outline"
                style="width: 70%;"
                @keyup.enter="login"
            />
            <v-img :src="codeImg" @click="getCode" class="mt-n3"></v-img>
          </div>

          <div  style="font-size: 14px;display: flex; justify-content: space-between;">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <v-checkbox
                      class="mt-n1"
                      dense
                      v-model="loginInfo.rememberMe"
                      :label="$t('login.rememberMe')"
                  ></v-checkbox>
                </div>
              </template>
              <span>{{ $t('login.rememberMeTip') }}</span>
            </v-tooltip>

            <router-link to="/forgetpassword" style="text-decoration:none;">
            <span style="font-size: 14px; color: #808080; align-self: center;">
              {{ $t('login.forgotPwd') }}
            </span>
            </router-link>
          </div>
        </v-card-text>
        <v-card-actions >
          <v-btn
              class="ml-8 mt-n5"
              color="blue"
              @click="login"
              outlined
              rounded
              width="150"
              :loading="isLoginning"
          >{{ $t('login.login') }}
          </v-btn>
          <v-spacer/>
          <v-btn
              class="mr-8 mt-n5"
              color="blue"
              width="150"
              outlined
              rounded
              to="/register"
          >{{ $t('login.register') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
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

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
  },

  data: () => ({
    isLoginning: false,
    codeImg: "",
    password: "",
    loginInfo: {
      code: "",
      codeUid: "",
      account: "",
      password: "",
      rememberMe: false
    },
    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  created() {
    this.getCode()
  },

  methods: {
    getCode() {
      this.$store.dispatch('getVerifyCodeImg').then(resp => {
        this.loginInfo.codeUid = resp.codeUid
        this.codeImg = resp.codeImg
      })
    },
    login() {
      this.$refs.obs.validate().then(isValidate => {
        if(isValidate) {
          this.isLoginning = true
          this.$store.dispatch('userLogin', this.loginInfo).then(resp => {
            if (resp) {
              this.$router.push('/')
            }
          }).catch(error => {
            if (error.response.data.code === 4104) {
              this.snackColor = 'error'
              this.snackbarText = this.$t('login.verifyError')
              this.snackbar = true
            } else if (error.response.data.code === 4109) {
              this.snackColor = 'error'
              this.snackbarText = this.$t('login.accountOrPwdError')
              this.snackbar = true
            }
            this.getCode()
            this.isLoginning = false
          })
        }
      })
    }
  },
};
</script>