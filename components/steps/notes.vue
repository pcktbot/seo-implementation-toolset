<template>
  <b-container fluid>
    <b-row>
      <div class="pb-0 text-left text-uppercase">
        {{ `Current Website: ${location.properties.current_website}` }}
      </div>
    </b-row>
    <b-row>
      <div v-if="location.properties.primary_type" class="pb-0 text-left">
        Property Type: <span class="font-weight-bold">{{ location.properties.primary_type }}</span>
      </div>
    </b-row>
    <b-row>
      <b-col
        v-for="(select, index) in selects"
        :key="select.id"
      >
        <b-form>
          <b-form-group
            :for="select.id"
            :label="select.id"
            class="pb-0 text-left text-uppercase"
          >
            <b-form-select
              :id="select.id"
              :value="location.properties[select.id]"
              :options="pickOptions(index)"
              @change="onInput(select.id, $event)"
            />
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
    <div>
      <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Enter a Note..."
        rows="3"
        max-rows="6"
      />
      <pre class="mt-3 mb-0">{{ newComment }}</pre>
    </div>
  </b-container>
</template>

<script>
import CommentsMixin from '~/mixins/comments'
export default {
  mixins: [CommentsMixin],
  props: {
    location: {
      type: Object,
      default() {
        return {}
      }
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      options: [
        { value: null, text: 'Select Status' },
        { value: 'req', text: 'Requested' },
        { value: 'acc', text: 'Accessed' },
        { value: 'new', text: 'Create New' },
        { value: 'unverified', text: 'Unverified' },
        { value: 'basic', text: 'N/A Basic Package' },
        { value: 'clientmanaged', text: 'N/A - Client Managed' }
      ],
      selects: [
        {
          id: 'gmb',
          value: null

        },
        {
          id: 'ga',
          value: null
        },
        {
          id: 'strategy',
          value: null,
          mfoptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'mfa', text: 'MF A' },
              { value: 'mfb', text: 'MF B' },
              { value: 'mfc', text: 'MF C' }
            ]
          },
          ssoptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'ssa', text: 'SS A' },
              { value: 'ssb', text: 'SS B' },
              { value: 'ssc', text: 'SS C' }
            ]
          },
          sloptions: {
            options: [
              { value: null, text: 'Select Strategy' },
              { value: 'sla', text: 'SL A' },
              { value: 'slb', text: 'SL B' },
              { value: 'slc', text: 'SL C' }
            ]
          }
        }
      ],
      comments: null,
      newComment: ''
    }
  },
  computed: {
    //
  },
  async created() {
    const { id: locationId, lpId } = this.location
    this.comments = await this.getAll(locationId, lpId)
  },
  methods: {
    pickOptions(index) {
      const vertical = this.form.selects[0].value
      return index === 2 ? this.selects[2][`${vertical}options`].options : this.options
    },
    onInput(key, val) {
      this.$emit('step-update', { key, val, id: this.location.id })
    }
  }
}
</script>

<style>

</style>
