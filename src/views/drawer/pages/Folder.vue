<template>
  <v-main>
    <template v-for="(item,index) in bookmark">
      <book-mark-card
        :key="item.id"
        ref="bm"
        :cardtitle="item.title"
        :desc="item.createdTime"
        :url="item.url"
        :id='item.id'
        :index="index"
        :top="!!item.topTime"
      />
    </template>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'
import BookMarkCard from "@/views/components/BookMarkCard"
export default {
  components: {
    BookMarkCard,
  },
  data: () => ({
    dark: true,
  }),

  computed: {
    ...mapGetters(['bookmark']),
    drawerSelected() {
      return this.$store.state.bookmark.drawerSelected
    }
  },

  created() {
    this.$store.commit('REMOVE_SELECTED_BM')
  },

  watch: {
    drawerSelected() {
      this.$store.commit('REMOVE_SELECTED_BM')
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.v-main ::v-deep .v-main__wrap {
  flex: 1 1 auto;
  max-width: 100%;
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
  // justify-content: start;
  height: min-content;
}
</style>