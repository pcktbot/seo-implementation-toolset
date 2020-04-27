<template>
  <div class="m-5">
    <b-row>
      <b-col
        v-for="select in selects"
        :key="select.id"
        class="mb-2 p"
        cols="12"
        md="4"
      >
        <b-form>
          <b-form-select
            :id="select.id"
            :value="select.value"
            :options="select.options"
            @change="onChange(select.id, $event)"
          />
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <span class="text-justify">
          <b-input
            id="keyword"
            v-model="keyword"
            @input="onInput($event)"
            placeholder="Add keyword"
          />
          <b-button @click="addKeyword" variant="secondary">
            Add
          </b-button>
        </span>
        <b-container class="p-3" style="border: 1.5px solid #ccc;">
          <draggable
            :list="list1"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneItem"
            @change="log"
            class="dragArea list-group pill-box"
          >
            <b-list-group-item v-for="element in list1" :key="element.id" class="list-group-item pillz">
              <!-- Need to add event handler so edit text updates data -->
              <span class="text" contenteditable="true">{{ element.name }}</span>
            </b-list-group-item>
          </draggable>
        </b-container>
      </b-col>
      <b-col>
        <h3>Draggable 2</h3>
        <b-container class="" style="border: 1px solid #ced4da; height: calc(1.5em + 0.75rem + 2px); border-radius: 0.25rem">
          <draggable
            :list="list2"
            @change="onAdd"
            tag="ul"
            class="dragArea list-group pill-box"
            group="people"
          >
            <li
              v-for="(element, idx) in list2"
              :key="element.id"
              class="list-group-item text-justify pillz"
            >
              <!-- Need to add event handler so edit text updates data -->
              <span class="text" contenteditable="true">{{ element.name }}</span>
              <i @click="removeAt(idx)" class="fa fa-times close" onmouseover="" style="cursor: pointer;">
                <b-img width="15" height="15" src="/red-x.svg" />
              </i>
            </li>
          </draggable>
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
let idGlobal = 8
export default {
  name: 'CustomClone',
  display: 'Custom Clone',
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      keyword: '',
      list1: [
        { name: 'dog 1', id: 1 },
        { name: 'dog 2', id: 2 },
        { name: 'dog 3', id: 3 },
        { name: 'dog 4', id: 4 }
      ],
      list2: []
    }
  },
  computed: {
    ...mapState({
      selects: state => state.initSelects.selects
    })
  },
  methods: {
    ...mapMutations({
      updateSelects: 'initSelects/updateSelects'
    }),
    onChange(key, value) {
      const i = this.selects.findIndex(select => select.id === key)
      this.updateSelects({ val: value, index: i })
    },
    log(evt) {
      window.console.log(evt)
    },
    onAdd(payload) {
      const name = payload.added.element.name
      if (this.list2.length === 2) {
        const removeIndex = this.list2.findIndex(item => item.name !== name)
        this.removeAt(removeIndex)
      }
    },
    cloneItem(payload) {
      const { name } = payload
      return { id: idGlobal++, name: `${name}` }
    },
    removeAt(idx) {
      this.list2.splice(idx, 1)
    },
    onInput(val) {
      this.keyword = val
    },
    addKeyword() {
      this.list1.push({ id: idGlobal++, name: this.keyword })
      this.keyword = ''
    }
  }
}
</script>
<style scoped>
.pillz  {
    color: black;
    background:var(--quaternary);
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: default;
    float: left;
    padding: 4px 15px;
    min-width: 70px;
    min-height: 3px;
}
.pill-box  {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    line-height: 1.42857143;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
