<template>
  <v-hover
      v-slot:default="{ }"
      disabled
  >
    <v-card
        :elevation="selected.length === 0 ? 2 : 24"
        width="263"
        class="ml-9 mt-4"
        outlined
        rounded="xl"
        img=""
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title style="font-size: 17px; display: flex; justify-content: space-between;">
            <span style="overflow: hidden; text-overflow: ellipsis; font-weight: 500;">{{ $attrs.cardtitle }}</span>
            <v-dialog v-model="addNoteDialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    v-show="!showImg"
                    icon
                    small
                    :title="$t('card.note.addNote')"
                    v-bind="attrs"
                    v-on="on"
                    height="20"
                    width="20"
                >
                  <v-icon size="20">mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  {{ $t('card.note.addNote') }}
                </v-card-title>
                <v-card-text>
                  <ValidationObserver
                      ref="obs"
                      v-slot="{ validated }"
                  >
                    <v-text-field-with-validation
                        :validated="validated"
                        rules="required"
                        placeholder="输入笔记标题"
                        v-model="newNoteInfo.title"
                    />
                    <v-textarea
                        solo
                        v-model="newNoteInfo.content"
                    />
                  </ValidationObserver>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                      :color="systemColor"
                      outlined
                      rounded
                      width="80"
                      @click="dialogClose"
                  >
                    {{ $t('appBar.dialogClose') }}
                  </v-btn>
                  <v-btn
                      :color="systemColor"
                      outlined
                      rounded
                      width="80"
                      @click="addNote"
                  >
                    {{ $t('appBar.dialogAdd') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <a target="_blank" :href="$attrs.url" rel="noopener" style="text-decoration: none;">
        <v-sheet
            dark
            :color="sheetColor"
            v-show="showImg"
            height="194"
            max-height="194"
            style="font-size: 100px; font-family: Georgia,serif; line-height: 180px;"
        >{{ showTitle }}
        </v-sheet>
      </a>

      <v-virtual-scroll
          v-show="!showImg"
          :items="noteOfBookmark"
          item-height="35"
          height="194"
      >
        <template v-slot="{ item, index }">
          <v-list-item>
            <v-list-item-content
                @click="showNote(item.title, item.content, item.id, index)"
            >
              <v-list-item-title style="font-size:15px;">{{ item.title }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-spacer/>
              <v-btn
                  icon
                  small
                  :title="$t('card.note.delete')"
                  @click="deleteNote( item.id, index )"
              >
                <v-icon :color="systemColor">mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>

      <v-divider/>

      <v-dialog v-model="showNoteDialog" max-width="700px">
        <v-card>
          <v-card-text>
            <div v-show="!showNoteEdit">
              <v-card-title style="font-size: 25px;">
                {{ showAndUpdateNoteInfo.title }}
              </v-card-title>
              <v-card-text
                  style="font-size:17px; color: black; height: 480px; overflow-y:scroll; line-height: 1.75rem;">
                {{ showAndUpdateNoteInfo.content }}
              </v-card-text>
            </div>
            <div v-show="showNoteEdit">
              <v-text-field
                  v-model="showAndUpdateNoteInfo.title"
                  style="font-size: 25px;"
                  :color="systemColor"

              />
              <v-textarea
                  outlined
                  v-model="showAndUpdateNoteInfo.content"
                  rows="15"
                  :color="systemColor"
                  style="font-size:17px; color: black"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
                :color="systemColor"
                outlined
                rounded
                width="100"
                @click="noteEdit"
            >
              {{ noteEditClickTimes % 2 === 0 ? $t('edit') : $t('appBar.dialogAdd') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="bookmarkEditDialog" max-width="700px">
        <v-card>
          <v-card-title>
            {{ $t('bookmark.edit') }}
          </v-card-title>
          <v-card-text class="pt-6">
            <ValidationObserver
                ref="obs"
                v-slot="{ validated }"
            >
              <VTextFieldWithValidation
                  :validated="validated"
                  v-model="updateBookmarkInfo.bookmarkInfo.title"
                  rules="required"
                  :label="$t('appBar.bookmarkTitle')"
              />
              <VTextFieldWithValidation
                  :validated="validated"
                  v-model="updateBookmarkInfo.bookmarkInfo.url"
                  rules="required"
                  :label="$t('appBar.bookmarkUrl')"
              />
            </ValidationObserver>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                :color="systemColor"
                outlined
                rounded
                width="100"
                @click="updBmConfirm"
            >
              {{ $t('appBar.dialogAdd') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card-text>
        {{ $t('bookmark.time') }}：{{ $attrs.desc }}
      </v-card-text>
      <v-card-actions>
        <v-checkbox
            :color="systemColor"
            class="my-n3 ml-1"
            v-model="selected"
            :value="$attrs.id"
            v-show="showChose"
        >
        </v-checkbox>
        <v-spacer/>
        <v-btn
            icon
            small
            depressed
            v-for="item in cardIcons"
            :key="item.title"
            link
        >
          <v-icon
              :title="item.title"
              @click="iconMethod(item.method)"
              :color="$attrs.top ? item.color : ''"
          >{{ item.icon }}
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";
import {mapGetters} from "vuex";

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
  },

  data: () => ({
    selected: [],
    noteEditClickTimes: 0,
    addNoteDialog: false,
    showNoteDialog: false,
    bookmarkEditDialog: false,
    showNoteEdit: false,
    showImg: true,
    noteBtnClick: 0,
    delNoteArr: {
      noteIds: []
    },
    bookmarkParam: {
      bookmarkArr: {
        bookmarkIds: [],
      },
      respAndIndex: {
        index: 0,
        resp: 0,
        data: {}
      }
    },
    noteOfBookmark: [],
    newNoteInfo: {
      parentId: '',
      content: '',
      title: ''
    },
    showAndUpdateNoteInfo: {
      parentId: '',
      content: '',
      id: '',
      title: '',
      index: 0
    },
    updateBookmarkInfo: {
      bookmarkInfo: {
        description: "",
        id: 0,
        tags: [],
        title: "",
        url: ""
      },
      respAndIndex: {
        resp: {},
        index: 0,
      }
    },
  }),

  computed: {
    ...mapGetters(['selectedBM', 'systemColor']),
    cardIcons() {
      return [
        {title: this.$t('card.bookmark.icon.note'), icon: "mdi-calendar-text", method: "bookmarkNote"},
        {title: this.$t('card.bookmark.icon.edit'), icon: "mdi-square-edit-outline", method: "bookmarkEdit"},
        {
          title: this.$t('card.bookmark.icon.top'),
          icon: "mdi-format-align-top",
          method: "top",
          color: this.systemColor
        },
        {title: this.$t('card.bookmark.icon.delete'), icon: "mdi-trash-can-outline", method: 'delete'}
      ]
    },
    showTitle() {
      return this.$attrs.cardtitle.charAt(0).toUpperCase()
    },
    sheetColor() {
      let arr = [
        'blue',
        'teal lighten-1',
        'blue-grey lighten-1',
        'light-green darken-1',
        'cyan'
      ]
      let i = Math.floor(Math.random() * (arr.length))
      return arr[i]
    },
    showChose() {
      return this.$store.state.bookmark.showChose
    },
    noteEditIcon() {
      return this.$t('edit')
    }
    // drawerSelected() {
    //   return this.$store.state.bookmark.drawerSelected
    // }
  },

  watch: {
    selected() {
      let setSelectedBM = {
        selected: this.selected,
        id: this.$attrs.id
      }
      this.$store.commit('SET_SELECTED_BM', setSelectedBM)
    },
    showChose() {
      if (this.selected.length !== 0) {
        this.selected = []
        this.$store.commit('REMOVE_SELECTED_BM')
      }
    }
  },

  methods: {
    updBmConfirm() {
      this.$store.dispatch('updateBookmarkInfo', this.updateBookmarkInfo).then(() => {
        this.bookmarkEditDialog = !this.bookmarkEditDialog
      })
    },
    noteEdit() {
      this.showNoteEdit = !this.showNoteEdit
      this.noteEditClickTimes++
      if (this.noteEditClickTimes % 2 === 0) {
        this.showAndUpdateNoteInfo.parentId = this.$attrs.id
        this.$store.dispatch('updateNoteInfo', this.showAndUpdateNoteInfo).then(() => {
          this.noteOfBookmark.splice(this.showAndUpdateNoteInfo.index, 1, Object.assign({}, this.showAndUpdateNoteInfo))
          this.noteEditIcon = this.$t('edit')
        })
      }
    },
    showNote(title, content, noteId, index) {
      this.showNoteDialog = true
      this.showAndUpdateNoteInfo.title = title
      this.showAndUpdateNoteInfo.content = content
      this.showAndUpdateNoteInfo.id = noteId
      this.showAndUpdateNoteInfo.index = index

    },
    dialogClose() {
      this.newNoteInfo.title = ''
      this.newNoteInfo.content = ''
      this.$refs.obs.reset()
      this.addNoteDialog = false
    },
    addNote() {
      this.newNoteInfo.parentId = this.$attrs.id
      this.$refs.obs.validate().then(isValidate => {
        if (isValidate) {
          this.$store.dispatch('addNote', this.newNoteInfo).then(resp => {
            this.noteOfBookmark.unshift(resp)
            this.newNoteInfo.title = ''
            this.newNoteInfo.content = ''
            this.$refs.obs.reset()
            this.addNoteDialog = false
          })
        }
      })
    },
    deleteNote(id, index) {
      this.delNoteArr.noteIds = []
      this.delNoteArr.noteIds.push(id)
      this.$store.dispatch('deleteNoteOfBookmark', this.delNoteArr)
      this.noteOfBookmark.splice(index, 1)
    },
    iconMethod(method) {
      this[method]()
    },
    bookmarkNote() {
      if (this.noteBtnClick === 0) {
        this.$store.dispatch('getNoteOfBookmark', this.$attrs.id).then(resp => {
          this.noteOfBookmark = resp
        })
        this.noteBtnClick++
      }
      this.showImg = !this.showImg
    },
    bookmarkEdit() {
      this.updateBookmarkInfo.bookmarkInfo.url = this.$attrs.url
      this.updateBookmarkInfo.bookmarkInfo.title = this.$attrs.cardtitle
      this.updateBookmarkInfo.bookmarkInfo.id = this.$attrs.id
      this.updateBookmarkInfo.respAndIndex.index = this.$attrs.index
      this.bookmarkEditDialog = !this.bookmarkEditDialog
    },
    async delete() {
      this.bookmarkParam.bookmarkArr.bookmarkIds = []
      this.bookmarkParam.bookmarkArr.bookmarkIds.push(this.$attrs.id)
      await this.$store.dispatch('deleteBookmark', this.bookmarkParam.bookmarkArr)
      await this.$store.commit('DELETE_BOOKMARK', this.$attrs.index)
    },
    top() {
      this.bookmarkParam.bookmarkArr.bookmarkIds = []
      this.bookmarkParam.bookmarkArr.bookmarkIds.push(this.$attrs.id)
      this.bookmarkParam.respAndIndex.index = this.$attrs.index
      if (this.$attrs.top === false) {
        this.$store.dispatch('bookmarkTop', this.bookmarkParam)
      } else {
        this.$store.dispatch('bookmarkTopCancel', this.bookmarkParam)
      }
    },
  }
}
</script>