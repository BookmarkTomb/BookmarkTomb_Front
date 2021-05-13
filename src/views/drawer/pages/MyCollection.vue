<template>
  <v-main>
    <template v-for="(item,index) in bookmark">
      <book-mark-card
          :key="item.id"
          type="bookmark"
          :cardtitle="item.title"
          :url="item.url"
          :desc="item.createdTime"
          :id='item.id'
          :index="index"
          :top="!!item.topTime"
      />
    </template>
  </v-main>
</template>

<script>
import {mapGetters} from 'vuex'
import BookMarkCard from "@/views/components/BookMarkCard"

export default {
  components: {
    BookMarkCard,
  },
  data: () => ({
    dark: true,
    sortAndOrder: {
      order: "desc",
      according: "defaults"
    },
  }),

  computed: {
    ...mapGetters(['selectedBM', 'bookmark']),
  },

  async created() {
    await this.$store.dispatch('getFavor', this.sortAndOrder)
    await this.$store.commit('REMOVE_SELECTED_BM')
    // await this.$store.dispatch('getBookmark', this.getBmInCollectionParam)
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