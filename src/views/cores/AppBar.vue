<template>
  <v-app-bar
      id="app-bar"
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
  >
    <v-btn
        fab
        icon
        @click="setShowDrawer(!showDrawer)"
    >
      <v-app-bar-nav-icon/>
    </v-btn>

    <v-toolbar-title class="d-none d-sm-flex">BookmarkTomb</v-toolbar-title>

    <v-spacer/>

    <div v-show="showChose">
      <v-btn icon :disabled="isDisabled" @click="updParentCollectionDia = true">
        <v-icon size="29">
          mdi-inbox-arrow-up
        </v-icon>
      </v-btn>
      <v-btn icon :disabled="isDisabled" @click="delBookmarks">
        <v-icon size="30">
          mdi-bookmark-remove-outline
        </v-icon>
      </v-btn>
    </div>
    <span style="cursor:pointer;" @click="setShowChose">
      {{ showChose ? $t('appBar.cancel') : $t('appBar.choose') }}
    </span>

    <v-dialog v-model="updParentCollectionDia" width="500">
      <v-card>
        <v-card-title>

        </v-card-title>
        <v-treeview
            :color="systemColor"
            :active.sync="choseActive"
            :items="changeCollectionTree"
            activatable
            hoverable
            item-key="id"
            transition
            dense
            @update:active="activeFun"
        >
          <template v-slot:prepend="{ }">
            <v-icon>mdi-folder-outline</v-icon>
          </template>
        </v-treeview>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              :color="systemColor"
              outlined
              rounded
              width="100"
              @click="updParentCollection"
          >
            {{ $t('appBar.dialogAdd') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialog"
        max-width="500px"
        @click:outside="resetDialog()"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            class="mx-2 d-flex"
            v-bind="attrs"
            v-on="on"
            icon
        >
          <v-icon
              size="30"
              :title="$t('appBar.add')"
          >
            mdi-bookmark-plus-outline
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          {{ $t('appBar.add') }}
        </v-card-title>
        <v-card-text>
          <ValidationObserver
              ref="addBM"
              v-slot="{ validated }"
          >
            <VTextFieldWithValidation
                :validated="validated"
                v-model="newBookmarkInfo.title"
                :placeholder="$t('appBar.enterBookmarkTitle')"
                rules="required"
            />
            <VTextFieldWithValidation
                :validated="validated"
                v-model="newBookmarkInfo.url"
                :placeholder="$t('appBar.enterUrl')"
                rules="required"
            />
          </ValidationObserver>
          <div v-show="!showOtherCollections">
            <v-row>
              <v-col cols="5">
                <v-text-field
                    :value="$t('drawer.myFavor')"
                    dense
                    outlined
                    disabled
                ></v-text-field>
              </v-col>
              <v-col cols="5" style="line-height: 40px;">
                <span
                    style="cursor:pointer; color: #1E88E5"
                    @click="showOtherCollections = true"
                >
                  {{ $t('appBar.otherFavorite') }}
                </span>
              </v-col>
            </v-row>
          </div>
          <div v-show="showOtherCollections">
            <v-treeview
                :active.sync="active"
                :items="treeItems"
                activatable
                hoverable
                item-key="id"
                transition
                dense
            >
              <template v-slot:prepend="{ }">
                <v-icon>mdi-folder-outline</v-icon>
              </template>
            </v-treeview>
          </div>
        </v-card-text>
        <v-card-actions>
          <div v-show="showOtherCollections">
            <v-icon class="mt-n1">
              mdi-chevron-left
            </v-icon>
            <span
                style="cursor:pointer; color: grey; font-size: 0.9rem"
                @click="back"
            >{{ $t('appBar.back') }}
          </span>
          </div>
          <v-spacer/>
          <v-btn
              outlined
              rounded
              :color="systemColor"
              width="100"
              @click="resetDialog()"
          >
            {{ $t('appBar.dialogClose') }}
          </v-btn>
          <v-btn
              :color="systemColor"
              outlined
              rounded
              width="100"
              @click="addBookmark"
          >
            {{ $t('appBar.dialogAdd') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-menu bottom offset-y v-model="searchMenu">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            v-model="search"
            v-bind="attrs"
            v-on="on"
            :color="systemColor"
            class="mx-2 rounded-lg d-none d-sm-flex"
            style="max-width: 300px; max-height: 40px;"
            prepend-inner-icon="mdi-magnify"
            filled
            dense
            rounded
            clearable
            :placeholder="$t('appBar.search')"
        >
        </v-text-field>
      </template>
      <v-list width="300">
        <template v-for="item in tempBookmark">
          <a :href="item.url" :key="item.id" target="_blank" class="text-decoration-none">
          <v-list-item  two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.url.substr(0,40) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          </a>
        </template>
      </v-list>
    </v-menu>
    <v-select
        v-model="language"
        class="mx-2"
        style=" max-width: 125px; max-height: 40px; "
        :items="languages"
        outlined
        dense
    ></v-select>

    <v-btn icon @click="systemColorDialog = true" class="d-none d-sm-flex">
      <v-icon size="30">
        mdi-tshirt-crew-outline
      </v-icon>
    </v-btn>

    <v-dialog v-model="systemColorDialog" width="600">
      <v-card>
        <v-card-title>{{ $t('appBar.color') }}</v-card-title>
        <v-card-text class="text-center">
          <template v-for="(item,index) in colorButton">
            <v-btn
                :key="index"
                class="mx-5"
                fab
                dark
                small
                :color="item"
                @click="changeColor(item)"
            >
              <v-icon dark v-show="systemColor === item">
                mdi-check
              </v-icon>
            </v-btn>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-menu offset-y class="ml-5">
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
            size="40"
            class="mx-2 d-none d-sm-flex"
            :color="systemColor"
            v-bind="attrs"
            v-on="on"
        >
          <img
              v-if="userAvatar"
              :src="userAvatar"
              :alt="username"
          />
          <span v-else class="white--text">{{ username ? username : 'Avatar' }} </span>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in personalCenter"
            :key="index"
            v-show="item.show"
            @click="personalCenterMethod(item.method)"
            dense
            :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title class="ml-n5">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";
import {logout} from "@/api/user";
import {getOwner} from "@/api/bookmark";

export default {
  name: 'BookmarkTombAppbar',

  components: {
    ValidationObserver,
    VTextFieldWithValidation
  },

  data: () => ({
    allBookmark: [], //用户所有书签
    tempBookmark: [], //存放搜索到的书签
    searchMenu: false,
    search: '',
    dialog: false,
    updParentCollectionDia: false,
    systemColorDialog: false,
    active: [],
    choseActive: [],
    languages: ['简体中文', 'English'],
    language: '简体中文',
    showOtherCollections: false,
    newBookmarkInfo: {
      parentId: 0,
      title: '',
      url: ''
    }
  }),

  computed: {
    ...mapGetters([
      'showDrawer',
      'username',
      'userAvatar',
      'userCollections',
      'treeItems',
      'bookmark',
      'showChose',
      'selectedBM',
      'isAdmin',
      'systemColor',
      'bookmark'
    ]),
    colorButton() {
      return ['purple darken-2', 'blue darken-2', 'teal darken-2', 'green darken-2', 'amber darken-2', 'deep-orange darken-2']
    },
    personalCenter() {
      return [
        {
          icon: 'mdi-account-circle-outline',
          title: this.$t('appBar.personalCenter.personalCenter'),
          to: '/myinfo',
          method: 'test',
          show: true
        },
        {
          icon: 'mdi-cogs',
          title: this.$t('appBar.personalCenter.managementCenter'),
          to: '/admin/system',
          method: 'test',
          show: this.isAdmin
        },
        {
          icon: 'mdi-power',
          title: this.$t('appBar.personalCenter.logOut'),
          method: 'logOut',
          show: true
        }
      ]
    },
    isDisabled() {
      return this.selectedBM.length === 0;
    },
    selected() {
      if (!this.active.length) return undefined
      return this.active[0]
    },
    changeCollectionTree() {
      let myFov = {
        id: 0,
        name: this.$t('drawer.myFavor')
      }
      let tree = JSON.parse(JSON.stringify(this.treeItems));
      tree.unshift(myFov)
      return tree
    }
  },

  created() {
    if (localStorage.getItem('lang')) {
      this.language = localStorage.getItem('lang')
    } else {
      this.language = '简体中文'
    }
    if (localStorage.getItem('systemColor') !== null) {
      this.$store.commit('SET_SYSTEM_COLOR', localStorage.getItem('systemColor'))
    }
    getOwner({order: "desc", according: "defaults"}).then(resp => {
      this.allBookmark = resp.data
    })
  },

  watch: {
    language() {
      this.$store.commit('SET_LANGUAGE', this.language)
    },
    search(val) {
      this.tempBookmark = val ? this.allBookmark.filter(item => item.title.indexOf(val) > -1) : []
      this.searchMenu = !!val
    }
  },

  methods: {
    ...mapMutations({
      setShowDrawer: 'SET_SHOW_DRAWER',
      setShowChose: 'SET_SHOW_CHOSE',
      setUpdToParentId: 'SET_UPD_TO_PARENT_ID'
    }),
    resetDialog() {
      this.newBookmarkInfo.title = ''
      this.newBookmarkInfo.url = ''
      this.$refs.addBM.reset()
      this.showOtherCollections = true
      this.active = []
      this.dialog = false
    },
    addBookmark() {
      this.$refs.addBM.validate().then(isValidate => {
        if (isValidate) {
          this.newBookmarkInfo.parentId = this.selected
          this.$store.dispatch('addBookmark', this.newBookmarkInfo).then(() => {
            this.newBookmarkInfo.title = ''
            this.newBookmarkInfo.url = ''
            this.$refs.addBM.reset()
            this.dialog = false
            this.showOtherCollections = true
            this.active = []
          })
        }
      })
    },
    personalCenterMethod(method) {
      this[method]()
    },
    async logOut() {
      await logout()
      localStorage.removeItem('Bookmark_Tomb_Token')
      await this.$router.push('/login')
    },
    async updParentCollection() {
      let fromParentId = this.bookmark[0].parentId
      if (fromParentId === undefined)
        fromParentId = null
      await this.$store.commit('SET_UPD_PARENT_ID', fromParentId)
      await this.$store.dispatch('updateParentCollection')
      this.updParentCollectionDia = false
    },
    activeFun(choseSelected) {
      this.setUpdToParentId(choseSelected[0])
    },
    async delBookmarks() {
      let delBMIds = {
        bookmarkIds: this.selectedBM
      }
      await this.$store.dispatch('deleteBookmark', delBMIds)
      await this.$store.commit('REMOVE_SELECTED')
    },
    back() {
      //添加书签选择其他收藏夹返回至我的收藏
      this.active = []
      this.showOtherCollections = false
    },
    changeColor(color) {
      this.$store.commit('SET_SYSTEM_COLOR', color)
      localStorage.setItem('systemColor', color)
    },
    test() {

    }
  }
}
</script>
