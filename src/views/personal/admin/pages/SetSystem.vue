<template>
  <div>
    <v-card flat>
      <v-card-title>
        {{ $t('setSystem.info') }}
        <v-btn
            icon
            color="red"
            class="ml-3"
            :title="$t('setSystem.shutDown')"
            @click="shutdownSystem()"
        >
          <v-icon>
            mdi-power
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="2">
            {{ $t('setSystem.name') }}：{{ name }}
          </v-col>
          <v-col cols="2">
            {{ $t('setSystem.version') }}：{{ version }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            {{ $t('setSystem.serverPort') }}：{{ serverPort }}
            <v-btn
                small
                outlined
                rounded
                class="ml-3"
                color="grey"
                @click="updServerPort"
            >
              {{ $t('setSystem.modify') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.register') }}：
            <v-switch
                dense
                :disabled="!emailEnable"
                v-model="registerEnable"
                style="margin-left: 120px; margin-top: -26px;"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title class="mt-n5">
        {{ $t('setSystem.db.dbInfo') }}
        <v-btn
            small
            outlined
            rounded
            class="ml-3"
            color="grey"
            @click="updDb"
        >
          {{ $t('setSystem.modify') }}
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.name') }}：{{ db.dbname }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.host') }}：{{ db.host }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.port') }}：{{ db.port }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.username') }}：{{ db.username }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.passwd') }}：{{ dbShowPasswd ? db.password : '*******' }}
            <v-btn icon @click="dbShowPasswd = !dbShowPasswd">
              <v-icon>
                {{ dbShowPasswd ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>
        {{ $t('setSystem.email.emailInfo') }}
        <v-btn
            small
            outlined
            rounded
            class="ml-3"
            :loading="emailLoading"
            @click="disableEmailConf"
            :color="emailEnable? 'error' : 'success'"
        >
          {{ emailEnable ? $t('setSystem.email.close') : $t('setSystem.email.open') }}
        </v-btn>
        <v-btn
            small
            outlined
            rounded
            class="ml-3"
            color="grey"
            @click="updEmail"
        >
          {{ $t('setSystem.modify') }}
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.host') }}：{{ email.host }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.port') }}：{{ email.port }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.username') }}：{{ email.username }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            {{ $t('setSystem.db.passwd') }}：{{ emailShowPasswd ? email.password : '********' }}
            <v-btn icon @click="emailShowPasswd = !emailShowPasswd">
              <v-icon>
                {{ emailShowPasswd ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="updDialog" width="600" @click:outside="cancelUpd">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text v-show="updType === 'email'">
          <v-text-field
              dense
              class="mt-3"
              :label="$t('setSystem.db.host')"
              v-model="email.host"
          />
          <v-text-field
              dense
              class="mt-3"
              :label="$t('setSystem.db.port')"
              v-model="email.port"
          />
          <v-text-field
              dense
              class="mt-3"
              :label="$t('setSystem.db.username')"
              v-model="email.username"
          />
          <v-text-field
              dense
              class="mt-3"
              :label="$t('setSystem.db.passwd')"
              v-model="email.password"
          />
        </v-card-text>
        <v-card-text v-show="updType === 'db'">
          <v-text-field
              dense
              :label="$t('setSystem.db.name')"
              class="mt-3"
              v-model="db.dbname"
          />
          <v-text-field
              dense
              :label="$t('setSystem.db.host')"
              class="mt-3"
              v-model="db.host"
          />
          <v-text-field
              dense
              :label="$t('setSystem.db.port')"
              class="mt-3"
              v-model="db.port"
          />
          <v-text-field
              dense
              :label="$t('setSystem.db.username')"
              class="mt-3"
              v-model="db.username"
          />
          <v-text-field
              dense
              :label="$t('setSystem.db.passwd')"
              class="mt-3"
              v-model="db.password"
          />
        </v-card-text>
        <v-card-text v-show="updType === 'serverPort'">
          <v-text-field
              dense
              :label="$t('setSystem.serverPort')"
              class="mt-3"
              v-model="serverPort"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              outlined
              rounded
              color="blue darken-1"
              width="100"
              @click="cancelUpd"
          >
            {{ $t('appBar.dialogClose') }}
          </v-btn>
          <v-btn
              outlined
              rounded
              color="blue darken-1"
              width="100"
              @click="confirmUpd"
          >
            {{ $t('appBar.dialogAdd') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm-dialog
        :dialog="confirmDialog"
        :dialogText="dialogText"
        :loading="shutdownLoading"
        @close="confirmDialog = $event"
        @funConfirm="shutdownConfirm"
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
import {mapGetters} from "vuex";
import {
  disableEmailConf,
  disableRegisterConf,
  enableRegisterConf,
  getDatabaseConf,
  getEmailConf,
  getPortConf,
  getRegisterConf, updDatabaseConf, updEmailConf, updPortConf
} from "@/api/admin";
import ConfirmDialog from "@/views/components/ConfirmDialog";

export default {
  components: {ConfirmDialog},

  data: () => ({
    serverPort: 8080,
    registerEnable: '',
    db: Object,
    emailEnable: Boolean,
    email: Object,
    shutdownLoading: false,
    emailLoading: false,
    confirmDialog: false,
    updDialog: false,
    dialogText: '',
    snackbar: false,
    snackColor: "",
    snackbarText: "",
    updType: '',
    dialogTitle: '',
    dbShowPasswd: false,
    emailShowPasswd: false
  }),

  computed: {
    ...mapGetters(['name', 'version']),
  },

  created() {
    this.$store.dispatch('getVersion')
    getDatabaseConf().then(resp => {
      this.db = resp.data
    })
    getEmailConf().then(resp => {
      this.emailEnable = resp.data.emailEnable
      this.email = resp.data.email
    })
    getPortConf().then(resp => {
      this.serverPort = resp.data.serverPort
    })
    getRegisterConf().then(resp => {
      this.registerEnable = resp.data.registerEnable
    })
  },

  watch: {
    registerEnable() {
      if (this.registerEnable) {
        enableRegisterConf()
      } else {
        disableRegisterConf()
      }
    }
  },

  methods: {
    shutdownSystem() {
      this.confirmDialog = true
      this.dialogText = this.$t('setSystem.shutDownConfirm')
    },
    shutdownConfirm() {
      this.shutdownLoading = true
      this.$store.dispatch('shutdownSystem').then(() => {
      }).catch(() => {
        this.snackbarText = this.$t('setSystem.shutDownSuccess')
        this.snackbar = true
        this.shutdownLoading = false
      })
    },
    disableEmailConf() {
      this.emailLoading = true
      if (this.emailEnable) {
        disableEmailConf().then(() => {
          this.snackColor = 'dark'
          this.snackbarText = this.$t('setSystem.emailClosed')
          this.snackbar = true
          this.emailEnable = false
          this.emailLoading = false
          this.registerEnable = false
        })
      } else {
        this.emailLoading = true
        updEmailConf(this.email).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('setSystem.emailOpened')
          this.snackbar = true
          this.emailEnable = true
          this.emailLoading = false
        })
      }
    },
    updServerPort() {
      this.updType = 'serverPort'
      this.updDialog = true
      this.dialogTitle = this.$t('setSystem.changeServerPort')
    },
    updEmail() {
      this.updType = 'email'
      this.updDialog = true
      this.dialogTitle = this.$t('setSystem.changeEmail')
    },
    updDb() {
      this.updType = 'db'
      this.updDialog = true
      this.dialogTitle = this.$t('setSystem.changeDB')
    },
    cancelUpd() {
      if (this.updType === 'email') {
        getEmailConf().then(resp => {
          this.email = resp.data.email
        })
      } else if (this.updType === 'db') {
        getDatabaseConf().then(resp => {
          this.db = resp.data
        })
      } else if (this.updType === 'serverPort') {
        getPortConf().then(resp => {
          this.serverPort = resp.data.serverPort
        })
      }
      this.updDialog = false
    },
    confirmUpd() {
      if (this.updType === 'email') {
        updEmailConf(this.email).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('setSystem.modifySuccess')
          this.snackbar = true
          this.updDialog = false
        }).catch(() => {
          this.snackColor = 'ERROR'
          this.snackbarText = this.$t('setSystem.modifyError')
          this.snackbar = true
          this.updDialog = false
        })
      } else if (this.updType === 'db') {
        updDatabaseConf(this.db).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('setSystem.modifySuccess')
          this.snackbar = true
          this.updDialog = false
        }).catch(() => {
          this.snackColor = 'ERROR'
          this.snackbarText = this.$t('setSystem.modifyError')
          this.snackbar = true
          this.updDialog = false
        })
      } else if (this.updType === 'serverPort') {
        updPortConf(this.serverPort).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('setSystem.modifySuccess')
          this.snackbar = true
          this.updDialog = false
        }).catch(() => {
          this.snackColor = 'ERROR'
          this.snackbarText = this.$t('setSystem.modifyError')
          this.snackbar = true
          this.updDialog = false
        })
      }
    }
  }
}
</script>