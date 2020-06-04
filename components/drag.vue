<template>
  <draggable
    v-model="list"
    :group="groupObj"
    :clone="cloneItem"
    @change="onAdd($event)"
    class="dragArea list-group pill-box"
  >
    <b-list-group-item
      v-for="element in compform[listName]"
      :key="`${listName}-${element.id}`"
      class="list-group-item pillz"
    >
      <div class="form-inline" style="display: inline-block;">
        <b-input
          :key="`${element.id}`"
          v-autowidth="{maxWidth: '960px', minWidth: '20px', comfortZone: 0}"
          :value="element.name"
          @input="updateKeywordVal(listName, element.id, $event)"
          style="background-color: var(--quaternary); border: none; height: 1.25em;"
          type="text"
          class="p-0"
        />
        <span @click="removeAt(listName, element.id)" class="m-0 p-0" onmouseover="" style="cursor: pointer;">
          <b-img width="15" height="15" src="/red-x.svg" style="vertical-align: middle" />
        </span>
      </div>
    </b-list-group-item>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    draggable
  },
  props: {
    listName: {
      type: String,
      default() {
        return ''
      }
    },
    groupObj: {
      type: Object,
      default() {
        return {}
      }
    },
    needsChangeEvnt: {
      type: Boolean,
      default() {
        return false
      }
    },
    stepComplete: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data () {
    return {
      idGlobal: 1000
    }
  },
  computed: {
    ...mapGetters({
      compform: 'selectedLocation/stepTwoData'
    }),
    list: {
      get() { return this.compform[this.listName] },
      async set(value) {
        await this.$store.commit('selectedLocation/UPDATE_KEYWORD_LIST', { key: this.listName, val: value })
        this.updateProp({ key: 'stepTwoComplete', val: this.stepComplete })
      }
    }
  },
  methods: {
    ...mapMutations({
      deleteKeyword: 'selectedLocation/DELETE_KEYWORD',
      updateKeyword: 'selectedLocation/UPDATE_KEYWORD',
      updateProp: 'selectedLocation/UPDATE_PROP'
    }),
    cloneItem(payload) {
      const { name } = payload
      return { id: this.idGlobal++, name: `${name}` }
    },
    async removeAt(list, id) {
      const idx = this.compform[list].findIndex(item => item.id === id)
      await this.deleteKeyword({ key: list, index: idx })
      this.updateProp({ key: 'stepTwoComplete', val: this.stepComplete })
    },
    updateKeywordVal(property, id, event) {
      const idx = this.compform[property].findIndex(item => item.id === id)
      this.updateKeyword({ key: property, index: idx, data: event })
    },
    onAdd(payload) {
      if (this.needsChangeEvnt) {
        const { newIndex } = payload.added
        if (this.compform[this.listName].length === 2) {
          const itemIndex = newIndex === 1 ? 0 : 1
          const removeID = this.compform[this.listName][itemIndex].id
          this.removeAt(this.listName, removeID)
        }
      }
    }
  }

}
</script>

<style>

</style>
