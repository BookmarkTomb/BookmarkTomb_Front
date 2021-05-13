<template>
  <ValidationProvider
      :name="$attrs.label"
      :rules="rules"
      v-slot="{ errors, valid }"
      :vid="vid"
      ref="field">
    <v-text-field
        dense
        :color="systemColor"
        :placeholder="$attrs.placeholder"
        required
        :outlined="$attrs.outlined"
        :value="value"
        :error-messages="(validated)? errors : null"
        :success="valid"
        :label="$attrs.label"
        :type="type"
        v-on="$listeners"
        :prepend-inner-icon="$attrs.icon"
    >
      <template v-slot:append="">
        <v-btn
            icon
            small
            :loading="$attrs.loading"
            v-if="$attrs.appendIcon"
            @click="appendIconFun"
        >
          <v-icon color="blue">
            {{ $attrs.appendIcon }}
          </v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
import {ValidationProvider} from "vee-validate";
import {mapGetters} from "vuex";

export default {
  components: {
    ValidationProvider
  },
  props: {
    rules: {
      type: [Object, String],
      default: ""
    },
    // must be included in props
    value: {
      type: String
    },
    validated: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    vid: {
      type: String,
      default: ""
    },
  },

  data:() => ({
    // appendIconLoading: false
  }),

  computed: {
    ...mapGetters(['systemColor']),
  },

  methods: {
    async appendIconFun() {
      // this.appendIconLoading = true
      await this.$emit('appendIconFun')
    }
  }
}
</script>