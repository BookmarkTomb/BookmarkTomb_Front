<template>
  <div style="height: 100%; background: #F0F8FF;">
    <v-card width="800" class="mx-auto my-5" v-show="!initSuccess">
      <v-card-title>The basic settings</v-card-title>
      <v-card-text>
        <v-divider/>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Server port：
          </v-col>
          <v-col cols="2" :class="textFieldClass">
            <v-text-field v-model="initSystem.serverPort" outlined dense/>
          </v-col>
          <v-col cols="3" class="ml-16">
            <v-checkbox
                v-model="initSystem.emailEnable"
                dense
                label="E-mail service"
            />
          </v-col>
          <v-col cols="4" class="ml-5">
            <v-checkbox
                v-model="initSystem.registerEnable"
                dense
                :disabled="disabled"
                label="Register service"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>Database settings</v-card-title>
      <v-card-text>
        <v-divider/>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Host：
          </v-col>
          <v-col cols="2" :class="textFieldClass">
            <v-text-field v-model="initSystem.database.host" outlined dense/>
          </v-col>
          <v-col cols="2" style="margin-left: 15%">
            Port：
          </v-col>
          <v-col cols="2" :class="textFieldClass">
            <v-text-field v-model="initSystem.database.port" outlined dense placeholder="27017"/>
          </v-col>
        </v-row>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            DB name：
          </v-col>
          <v-col cols="4" :class="textFieldClass">
            <v-text-field v-model="initSystem.database.dbname" outlined dense/>
          </v-col>
        </v-row>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Username：
          </v-col>
          <v-col cols="4" :class="textFieldClass">
            <v-text-field v-model="initSystem.database.username" outlined dense/>
          </v-col>
        </v-row>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Password：
          </v-col>
          <v-col cols="4" :class="textFieldClass">
            <v-text-field v-model="initSystem.database.password" outlined dense/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>E-mail server settings
      </v-card-title>
      <v-card-text>
        <v-divider/>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Host：
          </v-col>
          <v-col cols="2" :class="textFieldClass">
            <v-text-field v-model="initSystem.email.host" outlined dense/>
          </v-col>
          <v-col cols="2" style="margin-left: 15%">
            Port：
          </v-col>
          <v-col cols="2" :class="textFieldClass">
            <v-text-field v-model="initSystem.email.port" outlined dense/>
          </v-col>
        </v-row>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Username：
          </v-col>
          <v-col cols="4" :class="textFieldClass">
            <v-text-field v-model="initSystem.email.username" outlined dense/>
          </v-col>
        </v-row>
        <v-row
            align="center"
            justify="start"
            no-gutters
        >
          <v-col cols="2">
            Password：
          </v-col>
          <v-col cols="4" :class="textFieldClass">
            <v-text-field v-model="initSystem.email.password" outlined dense/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
            color="primary"
            class="mx-auto"
            outlined
            rounded
            width="150"
            :loading="loading"
            @click="initSystemFun"
        >
          Initialize
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-alert
        style="margin:-100px 0 0 -25%; width: 50%; position:absolute; top:50%; left:50%; text-align: center"
        border="top"
        color="success"
        dark
        v-show="initSuccess"
    >
      The system initialize successfully, please restart the service.<br>
      You can visit <a :href="url" class="text-decoration-none">{{ url }}</a>
    </v-alert>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  components: {
  },

  data: () => ({
    initSuccess: false,
    loading: false,
    textFieldClass: 'ml-n13 mt-5',
    disabled: false,
    initSystem: {
      database: {
        dbname: '',
        host: '',
        password: '',
        port: '',
        username: ''
      },
      email: {
        host: '',
        password: '',
        port: '',
        username: ''
      },
      emailEnable: true,
      registerEnable: true,
      serverPort: ''
    },
    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  computed: {
    ...mapGetters(['name', 'version']),
    emailEnable() {
      return this.initSystem.emailEnable
    },
    registerEnable() {
      return this.initSystem.registerEnable
    },
    url() {
      let url = window.location.href
      return url.substring(0, url.indexOf(':', 10) + 1) + this.initSystem.serverPort
    }
  },

  watch: {
    emailEnable() {
      if (this.initSystem.emailEnable === false) {
        this.initSystem.registerEnable = false
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },

  methods: {
    async initSystemFun() {
      this.loading = true
      await this.$store.dispatch('initSystem', this.initSystem).catch(error => {
        if (error.response !== undefined && error.response.data.code === 4000) {
          this.snackbar = true
          this.snackColor = 'error'
          this.snackbarText = 'Form data error!'
          this.loading = false
        } else if (error.response !== undefined && error.response.data.code === 5008) {
          this.snackbar = true
          this.snackColor = 'error'
          this.snackbarText = 'System has been initialized before!'
          this.loading = false
        } else {
          this.initSuccess = true
        }
      })
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.version) {
      next()
    } else {
      next(false)
    }
  }
}
</script>