<template>
  <div>
    <v-card style="max-width:98%;" class="mt-3">
      <v-card-title>
        {{ $t('monitor.name') }}
      </v-card-title>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ $t('monitor.attribute') }}</th>
              <th>{{ $t('monitor.value') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="( item, index ) in systemInformation" :key="index">
              <td>{{ index }}</td>
              <td>{{ item }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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
import { mapGetters } from 'vuex'
export default {
  data: ()=> ({
    systemInformation: '',
    snackbar: false,
    snackColor: "",
    snackbarText: ""
  }),

  computed: {
  ...mapGetters(['systemInfo']),
  },

  async created() {
    await this.$store.dispatch('getSystemInfo')
    //改变systemInfo的属性值
    this.systemInformation = JSON.parse(JSON.stringify(this.systemInfo)
        .replace(/osName/g, this.$t('systemInfo.osName'))
        .replace(/osVersion/g, this.$t('systemInfo.osVersion'))
        .replace(/arch/g, this.$t('systemInfo.arch'))
        .replace(/maxMemory/g, this.$t('systemInfo.maxMemory'))
        .replace(/currentMemory/g, this.$t('systemInfo.currentMemory'))
        .replace(/jvmMaxMemory/g, this.$t('systemInfo.jvmMaxMemory'))
        .replace(/jvmCurrentMemory/g, this.$t('systemInfo.jvmCurrentMemory'))
        .replace(/javaVersion/g, this.$t('systemInfo.javaVersion'))
        .replace(/currentDir/g, this.$t('systemInfo.currentDir'))
        .replace(/confDir/g, this.$t('systemInfo.confDir'))
        .replace(/currentPid/g, this.$t('systemInfo.currentPid'))
        .replace(/hostIp/g, this.$t('systemInfo.hostIp')));
  },
  methods: {

  }
}
</script>