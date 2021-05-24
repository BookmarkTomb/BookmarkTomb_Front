<template>
  <v-main style="height: 100%">
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
    <div class="noBM" v-show="bookmark.length === 0">
      There are no bookmarks here.
    </div>
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
  },


  methods: {}
}

</script>

<style lang="scss" scoped>
.v-main ::v-deep .v-main__wrap {
  flex: 1 1 auto;
  max-width: 100%;
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
}

.noBM {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: grey;
}
</style>