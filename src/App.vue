<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
import Vue from 'vue'
import {mapGetters} from "vuex";

export default Vue.extend({
  name: 'App',

  components: {},

  created() {
    this.$store.dispatch('getUserInfo')
    this.$store.dispatch('getUserAvatar')
    this.$store.dispatch('getVersion')
    if (localStorage.getItem('lang')) {
      this.$store.commit('SET_LANGUAGE', localStorage.getItem('lang'))
    } else {
      this.$store.commit('SET_LANGUAGE', '简体中文')
    }
  },

  watch: {
    language() {
      if (this.language === 'English') {
        this.$i18n.locale = 'en'
        localStorage.setItem('lang', 'English')
      } else if (this.language === '简体中文') {
        this.$i18n.locale = 'zh'
        localStorage.setItem('lang', '简体中文')
      }
    }
  },

  data: () => ({}),

  computed: {
    ...mapGetters(['name', 'version']),
    language() {
      return this.$store.state.publicInfo.language
    }
  },
})
</script>
