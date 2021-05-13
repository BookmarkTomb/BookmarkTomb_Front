<template>
  <v-navigation-drawer
      v-model="showDrawer"
      app
      id="navigation-drawer"
      clipped
  >
    <v-list>
      <list-item
          v-for="item in drawerUpperItems"
          :key="item.title"
          :to="item.to"
          :icon="item.icon"
          :title="item.title"
      />
      <v-divider/>

      <v-list-group
          prepend-icon="mdi-folder-outline"
          :value="listGroupValue"
          :color="systemColor"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ $t('drawer.collection') }}</v-list-item-title>
        </template>
        <v-treeview
            class="ml-9"
            :color="systemColor"
            :active.sync="active"
            :items="treeItems"
            activatable
            hoverable
            item-key="id"
            transition
            @update:active="activeFun"
        >
          <template v-slot:append="{ item, active }">
            <v-btn v-show="active" icon @click="editCollection(item)">
              <v-icon size="20" title="编辑收藏夹">mdi-square-edit-outline</v-icon>
            </v-btn>
          </template>
        </v-treeview>
        <v-text-field
            class="ml-9"
            filled
            dense
            :color="systemColor"
            v-model="insertTopCollection.title"
            :placeholder="$t('collection.addFavorite')"
            @keyup.enter="insertCollection"
        >
          <v-icon
              v-show="insertTopCollection.title"
              slot="append"
              color="success"
          >
            mdi-check
          </v-icon>
        </v-text-field>
        <v-dialog v-model="updateCollectionDialog" width="650">
          <v-card>
            <v-card-title>
              {{ $t('collection.edit') }}
            </v-card-title>
            <v-card-text>
              <ValidationObserver
                  ref="editCollection"
                  v-slot="{ validated }"
              >
                <div>
                  {{ $t('collection.name') }}
                </div>
                <VTextFieldWithValidation
                    :validated="validated"
                    v-model="updateCollectionInfoParam.title"
                    rules="required"
                />
                <div>
                  {{ $t('collection.addFavorite') }}
                </div>
                <VTextFieldWithValidation
                    :validated="validated"
                    v-model="insertCollectionParam.title"
                    rules="required"
                />
              </ValidationObserver>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  outlined
                  rounded
                  :loading="delLoading"
                  color="error"
                  width="100"
                  @click="deleteCollection()"
              >
                {{ $t('collection.delete') }}
              </v-btn>
              <v-btn
                  style="margin-left: 50%"
                  color="blue darken-1"
                  outlined
                  rounded
                  width="100"
                  @click="updateCollectionDialog = false"
              >
                {{ $t('appBar.dialogClose') }}
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  outlined
                  rounded
                  width="100"
                  @click="updateCollectionInfo()"
              >
                {{ $t('appBar.dialogAdd') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <list-item
          v-for="item in drawerBottomItems"
          :key="item.title"
          :to="item.to"
          :icon="item.icon"
          :title="item.title"
      />
    </template>
  </v-navigation-drawer>
</template>

<script>

import ListItem from "../components/ListItem"
import {mapGetters} from 'vuex'
import {generateTree} from "@/lib/utils/treeUtil";
import {ValidationObserver} from "vee-validate";
import VTextFieldWithValidation from "@/views/components/VTextFieldWithValidation";

export default {
  name: "BookmarkTombDrawer",

  components: {
    ListItem,
    ValidationObserver,
    VTextFieldWithValidation,
  },

  data: () => ({
    delLoading: false,
    oldActive: 0,
    active: [],
    listGroupValue: false,
    updateCollectionDialog: false,
    insertCollectionDialog: false,
    getBmInCollectionParam: {
      sortAndOrder: {
        order: "desc",
        according: "defaults",
      },
      collectionId: 1
    },
    updateCollectionInfoParam: {
      id: 0,
      title: ''
    },
    insertCollectionParam: {
      description: "",
      title: '',
      serverParentId: 0,
    },
    insertTopCollection: {
      description: "",
      title: '',
      serverParentId: 0,
    }
  }),

  async created() {
    if (this.username === undefined) {
      await this.$store.dispatch('getUserInfo')
      await this.$store.dispatch('getUserAvatar')
    }
    await this.$store.dispatch('getCollections')
    if (this.userCollections.length !== 0) {
      await this.$store.commit('SET_TREE_ITEMS', generateTree(this.userCollections))
    }else {
      await this.$store.commit('SET_TREE_ITEMS', [])
    }
  },

  computed: {
    ...mapGetters(['userAvatar', 'userCollections', 'newCollection', 'treeItems', 'systemColor']),
    showDrawer: {
      get() {
        return this.$store.getters.showDrawer;
      },
      set(val) {
        this.$store.commit("SET_SHOW_DRAWER", val);
      },
    },
    drawerUpperItems() {
      return [
        {title: this.$t('drawer.myFavor'), icon: 'mdi-heart-multiple-outline', to: '/'},
        {title: this.$t('drawer.myNotes'), icon: 'mdi-note-multiple-outline', to: '/my/note'},
      ]
    },
    drawerBottomItems() {
      return [
        {title: this.$t('drawer.recycleBin'), icon: "mdi-recycle-variant", to: "/recycle"},
      ]
    },
    selected() {
      if (!this.active.length) return undefined
      return this.active[0]
    },
  },

  watch: {
    $route: {
      handler(val) {
        if (val.path === '/') {
          this.$store.dispatch('setDrawerSelected', null)
          this.active = []
        } else if (val.path !== '/folder') {
          this.$store.dispatch('setDrawerSelected', undefined)
          this.active = []
        }
      }
    },
    // active(newActive, oldActive) {
    // }
  },
  methods: {
    editCollection(item) {
      this.updateCollectionDialog = true
      this.updateCollectionInfoParam.id = item.id
      this.updateCollectionInfoParam.title = item.name
    },
    async updateCollectionInfo() {
      await this.$store.dispatch('updateCollectionInfo', this.updateCollectionInfoParam)
      await this.$store.commit('UPDATE_COLLECTION', this.updateCollectionInfoParam)
      this.updateCollectionDialog = false
      if (this.insertCollectionParam.title.trim()) {
        this.insertCollectionParam.title = this.insertCollectionParam.title.trim()
        this.insertCollectionParam.serverParentId = this.updateCollectionInfoParam.id
        await this.$store.dispatch('insertCollection', this.insertCollectionParam)
      }
    },
    async insertCollection() {
      this.insertTopCollection.title = this.insertTopCollection.title.trim()
      await this.$store.dispatch('insertCollection', this.insertTopCollection)
      this.insertTopCollection.title = ''
    },
    async deleteCollection() {
      this.delLoading = true
      await this.$store.dispatch('deleteCollection', this.updateCollectionInfoParam.id)
      await this.$store.commit('DELETE_COLLECTION', this.updateCollectionInfoParam.id)
      this.updateCollectionDialog = false
      this.delLoading = false
    },
    async activeFun(selected) {
      selected = selected[0] === undefined ? [] : selected
      if (selected.length !== 0) {
        this.getBmInCollectionParam.collectionId = selected[0]
        await this.$store.dispatch('getBookmark', this.getBmInCollectionParam)
        await this.$store.dispatch('setDrawerSelected', selected[0])
        if (this.$route.path !== '/folder') {
          await this.$router.push('/folder')
        }
      }
      if (this.$route.path === '/folder') {
        if (selected.length === 0) {
          this.active.push(this.oldActive)
        } else {
          this.oldActive = selected[0]
        }
      }
    },
    test() {
      this.value = !this.value
    }
  }
};
</script>
