<template>
  <div style="height: 100%; background: #F0F8FF;">
    <v-card width="450" class="mx-auto" style="top: 20%">
      <v-card-title>
        <div class="mx-auto">Add an administrator account</div>
      </v-card-title>
      <v-card-text>
        <validation-observer
            ref="creatAdmin"
            v-slot="{ validated }"
        >
          <v-row
              align="center"
              justify="center"
              no-gutters
          >
            <v-col :cols="cols">
              <v-text-field-with-validation
                  :validated="validated"
                  rules="required"
                  placeholder="Username"
                  v-model="createAdminParam.username"
                  icon="mdi-account-outline"
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
                  rules="required|email"
                  placeholder="Email"
                  v-model="createAdminParam.email"
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
                  type="password"
                  vid="password"
                  placeholder="Password"
                  v-model="createAdminParam.password"
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
                  placeholder="Enter the password again"
                  v-model="confirmPass"
                  icon="mdi-lock-outline"
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-btn
                color="primary"
                class="mx-auto"
                outlined
                rounded
                :loading="loading"
                @click="createAdmin"
            >
              Create account
            </v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card-text>
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
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";

export default {
  name: "CreateAdmin",

  components: {
    ValidationObserver,
    VTextFieldWithValidation
  },

  data: () => ({
    cols: 8,
    loading: false,
    createAdminParam: {
      email: "",
      password: "",
      username: ""
    },
    confirmPass: "",
    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  methods: {
    createAdmin() {
      this.loading = true
      this.$store.dispatch('createAdmin', this.createAdminParam).then(async (data) => {
        this.snackbarText = 'success'
        this.snackColor = 'success'
        this.snackbar = true
        this.loading = false
        console.log(data)
        setTimeout(async () => {
          await this.$router.push('/login')
        },1000)
      }).catch(error => {
        if (error.response.data.code === 4000) {
          this.snackColor = 'error'
          this.snackbarText = 'Form data error!'
          this.snackbar = true
        } else if (error.response.data.code === 5009) {
          this.snackColor = 'error'
          this.snackbarText = 'Admin has been set before!'
          this.snackbar = true
          setTimeout(async () => {
            await this.$router.push('/login')
          },1000)
        }
        this.loading = false
      })
    }
  },

}
</script>

<style scoped>

</style>