<template>
  <div>
    <v-card style="max-width:98%; margin-top: 10px;">
      <v-card-title>
        {{ $t('onlineStatus.name') }}
        <v-spacer/>
        <v-text-field
            v-model="search"
            :color="systemColor"
            append-icon="mdi-magnify"
            :label="$t('userManagement.search')"
            hide-details
        />
        <v-btn
            class="mx-12"
            outlined
            rounded
            :color="systemColor"
            @click="offlineAllUsers"
        >{{ $t('onlineStatus.offlineAll') }}
        </v-btn>
      </v-card-title>
      <v-data-table
          :headers="onlineHeaders"
          :items="onlineInformation"
          :search="search"
          item-key="token"
          :items-per-page="100"
          hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
              small
              rounded
              outlined
              color="error"
              :loading="deleteLoading"
              @click="offlineToken(item.token)"
          >
            {{ $t('onlineStatus.delete') }}
          </v-btn>
          <v-btn
              small
              rounded
              outlined
              :color="systemColor"
              @click="offlineUser(item.id)"
          >
            {{ $t('onlineStatus.offline') }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <confirm-dialog
        :dialog="dialog"
        :dialogText="dialogText"
        @close="dialog = $event"
        @funConfirm="confirm"
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
import {mapGetters} from 'vuex'
import {removeToken} from '@/lib/storage/token'
import ConfirmDialog from "@/views/components/ConfirmDialog";
import {offlineToken} from "@/api/admin";

export default {
  components: {ConfirmDialog},
  data: () => ({
    deleteLoading: false,
    search: '',
    userId: '',
    dialog: false,
    dialogText: '',
    funType: '',
    snackbar: false,
    snackColor: '',
    snackbarText: '',
    onlineInformation: []  //将vuex中的文件改变信息后存在这里用于显示
  }),

  async created() {
    await this.$store.dispatch('getOnline')
    this.onlineInformation = JSON.parse(JSON.stringify(this.onlineInfo)
        .replace(/长期/g, this.$t('onlineInfo.long'))
        .replace(/临时/g, this.$t('onlineInfo.temporary')));
  },

  computed: {
    ...mapGetters(['onlineInfo', 'systemColor']),
    onlineHeaders() {
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
          text: "Ip",
          value: 'ip'
        },
        {
          text: this.$t('onlineStatus.device'),
          value: 'device',
          sortable: false
        },
        {
          text: this.$t('onlineStatus.state'),
          value: 'rememberMe',
        },
        {
          text: this.$t('onlineStatus.address'),
          value: 'address',
          sortable: false,
        },
        {
          text: this.$t('userManagement.actions'),
          value: 'actions',
          sortable: false,
        }
      ]
    }

  },

  methods: {
    offlineAllUsers() {
      this.dialog = true
      this.dialogText = this.$t('onlineStatus.isOfflineAll')
      this.funType = 'offlineAllUsers'
    },
    offlineUser(userId) {
      this.userId = userId
      this.dialog = true
      this.dialogText = this.$t('onlineStatus.isOffline')
      this.funType = 'offlineUser'
    },
    async confirm() {
      if (this.funType === 'offlineAllUsers') {
        await this.$store.dispatch('offlineAllUsers')
        removeToken()
        await this.$router.push('/login')
      } else if (this.funType === 'offlineUser') {
        this.$store.dispatch('offlineUser', this.userId).then(() => {
          this.snackColor = 'success'
          this.snackbarText = this.$t('onlineStatus.successOffline')
          this.snackbar = true
          this.onlineInformation = this.onlineInformation.filter(item => item.id !== this.userId)
        })
        this.dialog = false
      }
    },
    offlineToken(token) {
      this.deleteLoading = true
      offlineToken(token).then(() => {
        this.onlineInformation = this.onlineInformation.filter(item => item.token !== token)
        this.snackColor = 'success'
        this.snackbarText = this.$t('onlineStatus.successDelete')
        this.snackbar = true
        this.deleteLoading = false
      }).catch(() => {
        this.snackColor = 'error'
        this.snackbarText = 'Error'
        this.snackbar = true
        this.deleteLoading = false
      })
    }
  }
}
</script>
