<template>
<v-main id="card">
  <template v-for="(item,index) in noteInfo">
    <note-card
      :key="index"
      :title="item.title"
      :content="item.content"
      :id="item.id"
      :index="index"
      :parentId="item.parentId"
    />
  </template>
</v-main>
</template>

<script>
import { mapGetters } from 'vuex'
import NoteCard from "@/views/components/NoteCard"

export default {
  components: {
    NoteCard
  },
  data: () => ({
    dark: true
  }),

  computed: {
    ...mapGetters(['noteInfo']),
  },

  async created() {
    await this.$store.dispatch('getNoteOwner')
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
  height: min-content;
}
</style>