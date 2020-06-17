<template>
  <b-navbar>
    <b-navbar-brand to="/" class="d-flex align-items-center">
      <b-img
        class="mr-2 logo"
        src="/g5-logo-2.png"
        alt="G5 Corporate Logo"
      />
      <h2 class="nav-text mb-0 font-weight-bold" style="color: white">
        SEO Implementation
      </h2>
    </b-navbar-brand>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <slot name="alert" />
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto pr-2">
      <slot name="content" />
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
}
</script>

<style scoped>
.logo {
  width: 3em;
  height: 3em;
}
.navbar {
  background-color: var(--primary)
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .nav-text {
    font-size: 1.25rem
  }
  .logo {
  width: 2.75em;
  height: 2.75em;
}
}
/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .nav-text {
    font-size: 2rem
  }
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {

}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {

}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {

}
</style>
