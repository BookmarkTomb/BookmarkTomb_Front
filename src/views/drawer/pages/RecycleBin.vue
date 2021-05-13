<template>
  <v-main>
    <v-tabs
      background-color="white"
      :color="systemColor"
    >
      <v-tab>{{ $t('recycleBin.bookmark') }}</v-tab>
      <v-tab @click="getDeletedNote">{{ $t('recycleBin.note') }}</v-tab>
      <v-tab @click="getDeletedCollections">{{ $t('recycleBin.collection') }}</v-tab>

      <v-tab-item>
        <v-list single-line>
          <template v-for="(item, index) in deletedBookmarkInfo">
            <RecycleList
              type="bookmark"
              :index='index'
              :key="item.id"
              :id="item.id"
              :rmtm="item.removeTime.substr(0,10)"
              :url="item.url"
              :bookmarkTitle="item.title"
              icon="mdi-bookmark-outline"
            />
          </template>
        </v-list>
      </v-tab-item>

      <v-tab-item>
        <v-list single-line>
          <template v-for="(item,index) in deletedNoteInfo">
            <RecycleList
              type="note"
              :key="item.id"
              :index="index"
              :id="item.id"
              :rmtm="item.removeTime.substr(0,10)"
              :url="item.content"
              :bookmarkTitle="item.title"
              icon="mdi-note-outline"
            />
          </template>
        </v-list>
      </v-tab-item>

      <v-tab-item>
        <v-list>
          <template v-for="(item,index) in deletedCollections">
            <RecycleList
                type="collection"
                :key="item.id"
                :id="item.id"
                :url="item.url"
                :index="index"
                :rmtm="item.removeTime.substr(0,10)"
                :bookmarkTitle="item.title"
                icon="mdi-folder-outline"
            />
          </template>
        </v-list>
      </v-tab-item>

    </v-tabs>

  </v-main>
</template>

<script>
import {  mapGetters } from 'vuex'
import RecycleList from "@/views/components/RecycleList";
export default {
  components: {
    RecycleList
  },
  data: () => ({

  }),

  created() {
      this.$store.dispatch('getDeletedBookmarks')
  },

  computed: {
    ...mapGetters(['deletedBookmarkInfo', 'deletedNoteInfo', 'deletedCollections', 'systemColor']),
  },


  methods: {
    getDeletedNote() {
      this.$store.dispatch('getDeletedNotes')
    },
    async getDeletedCollections() {
      await this.$store.dispatch('getDeletedCollections')
    }
  }
}
</script>
