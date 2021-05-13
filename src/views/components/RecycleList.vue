<template>
  <v-list-item
    :key="$attrs.id" 
  >
    <v-list-item-icon>
      <v-icon>{{ $attrs.icon }}</v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title>
        <div style="display: -webkit-flex; display: flex;justify-content: space-between;">
          <div>
            {{ $attrs.bookmarkTitle }}
          </div>
          <div>
            {{ $attrs.rmtm }}
          </div>
        </div>
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ url }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
          icon
          :color="systemColor"
          @click="restore"
          :loading="loading"
          :title="$t('recycleBin.restore')"
      >
        <v-icon>
            mdi-restore
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import {mapGetters} from "vuex";

export default {

  data: () => ({
    loading: false,
    restoreBookmarkParam: {
      restoreBookmarkArr: {
        bookmarkIds: []
      },
      index: 0
    },
    restoreNoteParam: {
      restoreNoteArr:{
        noteIds: []
      },
      index: 0
    },
    restoreCollectionParam: {
      collectionId: 0,
      index: 0
    }
  }),

  props: {
    value: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapGetters(['systemColor']),
    url() {
      if(this.$attrs.type === 'note') {
        if(this.$attrs.url.length > 20) {
          return this.$attrs.url.substr(0,20)+'...'
        }else {
          return this.$attrs.url
        }
      }else {
        return 'url：'+this.$attrs.url
      }
    }
  },

  methods: {
    async restore() {
      this.loading = true
      if(this.$attrs.type === 'bookmark'){
        this.restoreBookmarkParam.restoreBookmarkArr.bookmarkIds.push(this.$attrs.id)
        this.restoreBookmarkParam.index = this.$attrs.index
        await this.$store.dispatch('restoreBookmark', this.restoreBookmarkParam)
      }else if(this.$attrs.type === 'note'){
        this.restoreNoteParam.restoreNoteArr.noteIds.push(this.$attrs.id)
        this.restoreNoteParam.index = this.$attrs.index
        await this.$store.dispatch('restoreNote', this.restoreNoteParam)
      }else if(this.$attrs.type === 'collection') {
        this.restoreCollectionParam.collectionId = this.$attrs.id
        this.restoreCollectionParam.index = this.$attrs.index
        await this.$store.dispatch('restoreCollection', this.restoreCollectionParam).catch(() => {
          this.loading = false
        })
        await this.$store.dispatch('getCollectionByParent', this.restoreCollectionParam.collectionId).catch(() => {
          this.loading = false
        })
        await this.$store.commit('RESTORE_COLLECTION', this.restoreCollectionParam.index)
      }
      this.loading = false
    },
  }
}
</script>