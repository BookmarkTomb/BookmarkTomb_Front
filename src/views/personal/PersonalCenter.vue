<template>
  <div>
    <v-navigation-drawer
      fixed
      permanent
    >
      <v-list>
        <v-list-item
          v-for="item in personalMenu"
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
      personalMenu() {
        return [
          { title: this.$t('personal.message'), icon: 'mdi-account-circle-outline', to: '/myinfo' },
          { title: this.$t('personal.security'), icon: 'mdi-key-outline', to: '/changepassword' },
          { title: this.$t('personal.return'), icon: 'mdi-home-outline', to: '/' }
        ]
      }
    },
  }
</script>