<template>
  <div
    :class="[{ 'is-hidden': !isVisible }, drawerStyles, 'drawer-container', 'bg-white']"
  >
    <b-btn
      id="toggle-drawer"
      :class="btnStyles"
      :disabled="options.isDisabled"
      @click="isVisible = !isVisible"
      class="drawer-btn p-0"
      variant="secondary"
    >
      <slot name="button-text">
        <!-- DEFAULT BUTTON INNER -->
      </slot>
    </b-btn>
    <b-card no-body class="drawer-content border-0">
      <slot name="content" />
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'primary'
    },
    options: {
      type: Object,
      default() {
        return {
          position: 'left',
          slot: 'top',
          fullHeight: true,
          tab: true,
          isDisabled: false
        }
      }
    }
  },
  data() {
    return {
      isVisible: false
    }
  },
  computed: {
    drawerStyles() {
      return (this.options.position === 'left')
        ? (this.options.fullHeight)
          ? 'full-height attach-left'
          : 'attach-left'
        : (this.options.fullHeight)
          ? 'full-height attach-right'
          : 'attach-right'
    },
    btnStyles() {
      return (this.options.tab)
        ? 'tab-btn'
        : 'round-btn'
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  position: absolute;
  padding-bottom: 10px;
  top: 50%;
  width: 500px;
  max-width: 500px;
  min-height: 300px;
  z-index: 23;
  transition: 200ms ease-in-out;
  transition-delay: 100ms;
  transform: translate(0%, 0%);
  &.full-height {
    top: 0;
    bottom: 0;
  }
}
.drawer-container:not(.full-height) {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
  transform: translate(0%, -50%);
}
.drawer-btn {
  position: absolute;
  top: 50%;
  z-index: 23;
}
.attach-right {
  right: 0;
}
.attach-left {
  left: 0;
}
.attach-right.is-hidden {
  transform: translate(100%, 0%);
}
.attach-left.is-hidden {
  transform: translate(-100%, 0%);
}
.attach-right:not(.full-height).is-hidden {
  transform: translate(100%, -50%);
}
.attach-left:not(.full-height).is-hidden {
  transform: translate(-100%, -50%);
}
.attach-right > .drawer-btn {
  left: 0;
  border-radius: 10px 0 0 10px;
  transform: translate(-100%, -50%);
}
.attach-left > .drawer-btn {
  right: 0;
  border-radius: 0 10px 10px 0;
  transform: translate(100%, -50%);
}
.full-height .drawer-btn {
  top: 10%;
}
.full-height:not(.is-hidden)::before {
  position: absolute;
  z-index: 21;
  top: 0;
  height: 100%;
  right: 0;
  width: 100vw;
  content: "";
  background-color: rgba(0, 0, 0, 0.3);
  transform: translate(100%, 0%);
}
.drawer-content {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
}
.tab-btn {
  height: 90px;
  width: 30px;
}
.round-btn {
  width: 30px;
  min-height: 30px;
}
.drawer-btn:focus,
.drawer-btn:active {
  outline: none;
}
@media print {
  .drawer-container,
  .drawer-btn {
    display: none;
  }
}
</style>
