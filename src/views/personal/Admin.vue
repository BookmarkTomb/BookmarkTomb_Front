<template>
  <div>
    <v-navigation-drawer
      fixed
      permanent
    >
      <v-list>
        <v-list-item
          v-for="item in managementMenu"
          :key="item.title"
          :to="item.to"
          :color="systemColor"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div style="margin-left: 270px;">
      <router-view/>
    </div>
  </div>
</template>


<script>
  import {mapGetters} from "vuex";

  export default {
    computed: {
      ...mapGetters(['systemColor']),
      managementMenu() {
        return [
          { title: this.$t('management.settings'), icon: 'mdi-application-cog', to: '/admin/system'},
          { title: this.$t('management.monitor'), icon: 'mdi-desktop-classic', to: '/admin/monitor' },
          { title: this.$t('management.user'), icon: 'mdi-account-group', to: '/admin/user' },
          { title: this.$t('management.online'), icon: 'mdi-emoticon-happy-outline', to: '/admin/online'},
          { title: this.$t('management.return'), icon: 'mdi-home-outline', to: '/' }
        ]
      }
    },
  }
</script>