<template>
  <v-dialog v-model="confirmDialog" width="600" @click:outside="close">
    <v-card>
      <v-card-title style="font-size: 1rem">
        {{ $attrs.dialogText }}
      </v-card-title>
      <v-card-actions>
        <v-spacer/>
        <v-btn
            :color="systemColor"
            outlined
            rounded
            width="100"
            @click="close"
        >
          {{ $t('appBar.dialogClose') }}
        </v-btn>
        <v-btn
            outlined
            rounded
            :color="systemColor"
            width="100"
            :loading="loading"
            @click="confirm"
        >
          {{ $t('appBar.dialogAdd') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  props: ['dialog','loading'],

  data: () => ({
    confirmDialog: false,
    // dialogLoading: false,
  }),

  computed: {
    ...mapGetters(['systemColor'])
  },

  watch: {
    dialog() {
      this.confirmDialog = this.dialog
    },
  },

  methods: {
    confirm() {
      this.$emit('funConfirm')
    },
    close() {
      this.$emit('close', false)
    }
  }
}
</script>