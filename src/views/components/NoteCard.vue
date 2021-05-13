<template>
  <v-card
      width="263"
      class="ml-9 mt-4"
      :dark="dark"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ $attrs.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      {{ noteContent }}
    </v-card-text>

    <v-card-actions>

      <v-spacer/>

      <v-btn
          icon
          small
          v-for="item in cardIcons"
          :key="item.title"
          link
      >
        <v-icon :title="item.title" @click="iconMethod(item.method)">{{ item.icon }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="noteEditDialog" max-width="700px">
      <v-card>
        <v-card-text>
          <v-text-field :color="systemColor" v-model="updateNote.title" style="font-size: 25px;"/>
          <v-textarea :color="systemColor" outlined v-model="updateNote.content" rows="15" style="font-size:17px; color: black;"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              :color="systemColor"
              outlined
              rounded
              width="100"
              @click="editConfirm()"
           >
            {{ $t('appBar.dialogAdd') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
  },

  data: () => ({
    updateNote: {
      parentId: '',
      content: '',
      id: '',
      title: '',
      index: 0
    },
    noteEditDialog: false,
    noteParam: {
      delArr: {
        noteIds: []
      },
      index: 0
    }
  }),

  computed: {
    ...mapGetters(['systemColor']),
    cardIcons() {
      return [
        {title: this.$t('card.bookmark.icon.edit'), icon: "mdi-square-edit-outline", method: "edit"},
        {title: this.$t('card.bookmark.icon.delete'), icon: "mdi-trash-can-outline", method: 'delete'}
      ]
    },
    noteContent() {
      if (this.$attrs.content.length > 15) {
        return this.$attrs.content.substr(0, 15) + '...'
      } else {
        return this.$attrs.content
      }
    }
  },

  methods: {
    editConfirm() {
      this.$store.dispatch('updateNoteInfo', this.updateNote).then(() => {
        this.noteEditDialog = false
      })
    },
    iconMethod(method) {
      this[method]()
    },
    edit() {
      this.noteEditDialog = true
      this.updateNote.title = this.$attrs.title
      this.updateNote.id = this.$attrs.id
      this.updateNote.content = this.$attrs.content
      this.updateNote.parentId = this.$attrs.parentId
      this.updateNote.index = this.$attrs.index
    },
    delete() {
      this.noteParam.delArr.noteIds = []
      this.noteParam.delArr.noteIds.push(this.$attrs.id)
      this.noteParam.index = this.$attrs.index
      this.$store.dispatch('deleteNote', this.noteParam)
    },
    test() {
    }
  }
}
</script>