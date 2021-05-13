<template>
  <v-list-item
      :to=" $attrs.to "
      :color="systemColor"
  >
    <v-list-item-icon>
      <v-icon>{{ $attrs.icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-title>{{ $attrs.title }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import {mapGetters} from "vuex";

export default {

  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({}),

  computed: {
    ...mapGetters(['systemColor']),
  }

}
</script>
