<template>
  <div>
    <v-card style="max-width:98%; margin-top: 10px;">
      <v-card-title>
        {{ $t('userManagement.name') }}
        <v-spacer/>
        <v-text-field
            :color="systemColor"
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('userManagement.search')"
            hide-details
        />

        <v-dialog v-model="addUserDialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                :color="systemColor"
                class="mx-12"
                depressed
                outlined
                rounded
                v-bind="attrs"
                v-on="on"
            >{{ $t('userManagement.newUser') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              {{ $t('userManagement.addNew') }}
            </v-card-title>
            <v-card-text>
              <ValidationObserver
                  ref="addUser"
                  v-slot="{ validated }"
              >
                <VTextFieldWithValidation
                    :validated="validated"
                    v-model="addUserInfo.username"
                    rules="required"
                    :label="$t('userManagement.username')"
                />
                <VTextFieldWithValidation
                    :validated="validated"
                    v-model="addUserInfo.email"
                    rules="required"
                    :label="$t('userManagement.email')"
                />
                <VTextFieldWithValidation
                    :validated="validated"
                    v-model="addUserInfo.password"
                    rules="required"
                    :label="$t('security.passwd')"
                />
              </ValidationObserver>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :color="systemColor" outlined rounded width="100" @click="addUserDialogClose">
                {{ $t('appBar.dialogClose') }}
              </v-btn>
              <v-btn :color="systemColor" outlined rounded width="100" :loading="addLoading" @click="addUser">
                {{ $t('appBar.dialogAdd') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table
          :headers="headers"
          :items="userInfo"
          :search="search"
          :items-per-page="100"
          hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
              small
              class="mr-2"
              :title="$t('edit')"
              @click="setUserInfo(item.id)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
              small
              class="mr-2"
              :title="item.isEnabled? $t('userManagement.delete') : $t('userManagement.restore')"
              @click="logoffOrRestore(item, item.isEnabled)"
          >
            {{ item.isEnabled ? 'mdi-account-remove' : 'mdi-restore' }}
          </v-icon>
          <v-btn
              :color="systemColor"
              dark
              small
              outlined
              rounded
              depressed
              @click="setUserPassw(item.id)"
          >
            {{ $t('userManagement.resetPasswd') }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="setUserPasswDialog" max-width="400px">
      <v-card>
        <v-card-title>
          {{ $t('userManagement.setPasswd') }}
        </v-card-title>
        <v-card-text>
          <ValidationObserver
              ref="setUserPassw"
              v-slot="{ validated }"
          >
            <VTextFieldWithValidation
                :validated="validated"
                v-model="setUserPasswParam.password"
                rules="required"
                :label="$t('userManagement.newPasswd')"
            />
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="systemColor" outlined rounded width="100" @click="setUserPwDialogClose">
            {{ $t('appBar.dialogClose') }}
          </v-btn>
          <v-btn :color="systemColor" outlined rounded width="100" @click="setUserPasswConf">{{
              $t('appBar.dialogAdd')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="setUserInfoDialog" max-width="400px">
      <v-card>
        <v-card-title>
          {{ $t('userManagement.editInfo') }}
        </v-card-title>
        <v-card-text>
          <ValidationObserver
              ref="setUserInfo"
              v-slot="{ validated }"
          >
            <VTextFieldWithValidation
                :validated="validated"
                v-model="setUserInfoParam.nickname"
                rules="required"
                :label="$t('userManagement.nickname')"
            />
          </ValidationObserver>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" outlined rounded width="100" @click="setUserInfoDialogClose">
            {{ $t('appBar.dialogClose') }}
          </v-btn>
          <v-btn color="blue darken-1" outlined rounded width="100" @click="setUserInfoConf">{{
              $t('appBar.dialogAdd')
            }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        :color="snackColor"
        v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";

export default {

  components: {
    ValidationObserver,
    VTextFieldWithValidation,
  },

  data: () => ({
    search: '',
    snackbar: false,
    snackColor: '',
    snackbarText: '',
    setUserInfoDialog: false,
    setUserPasswDialog: false,
    addUserDialog: false,
    addLoading: false,
    addUserInfo: {
      code: '1234',
      email: '',
      username: '',
      password: ''
    },
    setUserInfoParam: {
      id: 0,
      nickname: ''
    },
    logoffOrRestoreParam: {
      userId: 0,
      index: 0
    },
    setUserPasswParam: {
      id: 0,
      password: ''
    }
  }),

  computed: {
    ...mapGetters(['userInfo', 'systemColor']),
    headers() {
      return [
        {
          text: this.$t('userManagement.userid'),
          align: 'start',
          value: 'id',
        },
        {
          text: this.$t('userManagement.username'),
          value: 'username'
        },
        {
          text: this.$t('userManagement.email'),
          value: 'email',
          sortable: false
        },
        {
          text: this.$t('userManagement.name'),
          value: 'isEnabled',
          sortable: false
        },
        {
          text: this.$t('userManagement.actions'),
          value: 'actions',
          sortable: false,
        }
      ]
    }
  },

  created() {
    this.$store.dispatch('getAllUsers')
  },

  methods: {
    addUserDialogClose() {
      this.addUserInfo.username = ''
      this.addUserInfo.email = ''
      this.addUserInfo.password = ''
      this.$refs.addUser.reset()
      this.addUserDialog = false
    },
    addUser() {
      this.addLoading = true
      this.$refs.addUser.validate().then(isValidate => {
        if (isValidate) {
          this.$store.dispatch('addUser', JSON.parse(JSON.stringify(this.addUserInfo))).then(() => {
            this.addUserInfo.username = ''
            this.addUserInfo.email = ''
            this.addUserInfo.password = ''
            this.addUserDialog = false
            this.addLoading = false
            this.snackColor = 'success'
            this.snackbarText = this.$t('userManagement.addSuccess')
            this.snackbar = true
          }).catch(() => {
            this.addLoading = false
            this.snackColor = 'error'
            this.snackbarText = this.$t('userManagement.addError')
            this.snackbar = true
          })
        } else {
          this.addLoading = false
        }
      })
    },
    setUserInfo(userId) {
      this.setUserInfoParam.id = userId
      this.setUserInfoDialog = true
    },
    setUserInfoDialogClose() {
      this.setUserInfoParam.nickname = ''
      this.setUserInfoDialog = false
    },
    setUserInfoConf() {
      this.$refs.setUserInfo.validate().then(isValidate => {
        if (isValidate) {
          this.$store.dispatch('setUserInfo', this.setUserInfoParam).then(() => {
            this.setUserInfoParam.nickname = ''
            this.setUserInfoDialog = false
            this.snackColor = 'success'
            this.snackbarText = this.$t('userManagement.editSuccess')
            this.snackbar = true
          }).catch(() => {
            this.snackColor = 'error'
            this.snackbarText = this.$t('userManagement.editError')
            this.snackbar = true
          })
        }
      })
    },
    logoffOrRestore(item, isEnabled) {
      this.logoffOrRestoreParam.userId = item.id
      this.logoffOrRestoreParam.index = this.userInfo.indexOf(item)
      if (isEnabled) { //logoff
        this.$store.dispatch('logoffUser', this.logoffOrRestoreParam).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('userManagement.logoffSuccess')
          this.snackbar = true
        })
      } else {  //restore
        this.$store.dispatch('restoreUser', this.logoffOrRestoreParam).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('userManagement.logoffRestore')
          this.snackbar = true
        })
      }
    },
    setUserPwDialogClose() {
      this.$refs.setUserPassw.reset()
      this.setUserPasswParam.password = ''
      this.setUserPasswDialog = false
    },
    setUserPassw(userId) {
      this.setUserPasswParam.id = userId
      this.setUserPasswDialog = true
    },
    setUserPasswConf() {
      this.$refs.setUserPassw.validate().then(isValidate => {
        if (isValidate) {
          this.$store.dispatch('setUserPassw', this.setUserPasswParam).then(() => {
            this.setUserPasswParam.password = ''
            this.snackColor = 'success'
            this.snackbarText = this.$t('userManagement.resetSuccess')
            this.snackbar = true
            this.setUserPasswDialog = false
          }).catch(() => {
            this.snackColor = 'error'
            this.snackbarText = this.$t('userManagement.resetError')
            this.snackbar = true
          })
        }
      })
    }
  }
}
</script>