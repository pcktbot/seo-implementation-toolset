<template>
  <b-nav-item-dropdown
    id="my-nav-dropdown"
    text="☰"
    style="font-size: 32px;"
    no-caret
    toggle-class="nav-link-custom"
    class="text-white"
    right
  >
    <b-dropdown-item :href="`/lp-project/${lpId}`">
      LP Project
    </b-dropdown-item>
    <b-dropdown-item :href="`/redirects/${lpId}`">
      Redirects
    </b-dropdown-item>
    <b-dropdown-item :href="`/copy/${lpId}`">
      SEO Liquid Values
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      lpId: state => state.initSelects.lpId
    })
  }
}
</script>

<style scoped>

</style>
