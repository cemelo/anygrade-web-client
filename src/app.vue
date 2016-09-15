<template>
  <div id="app">
    <app-header :nav-active="navActive"
      @toggle-nav="onNavigationToggle()"
      @login="showLoginDialog()"></app-header>
    <app-content :nav-active="navActive"></app-content>

    <login-dialog :show='loginDialogVisible' @close='onLoginDialogClose()'></login-dialog>
  </div>
</template>

<script>
import AppHeader from './layout/app-header';
import AppContent from './layout/app-content';
import LoginDialog from './views/login-dialog';

import Config from './config';

export default {
  components: {
    AppHeader,
    AppContent,
    LoginDialog,
  },

  data() {
    return {
      navActive: true,
      loginDialogVisible: false,
    };
  },

  watch: {
    $route() {
      if (!this.$isServer && window.innerWidth <= Config.devices['iPhone-6S-Plus']
          && this.navActive) {
        this.navActive = false;
      }
    },
  },

  methods: {
    // Event Listeners
    onLoginDialogClose() {
      this.loginDialogVisible = false;
    },

    onNavigationToggle() {
      this.navActive = !this.navActive;
    },

    showLoginDialog() {
      this.loginDialogVisible = true;
    },
  },

  beforeMount() {
    if (window.innerWidth <= Config.devices['iPad']) {
      this.navActive = false;
    } else {
      this.navActive = true;
    }
  },

  mounted() {
  },
};
</script>

<style lang="stylus">
@require "~components/styles/devices";
@require "~components/styles/palette";

$header-background-color = flat-color(belize-hole);

html, body
  font-family: -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Fira Sans", "Droid Sans", "Helvetica Neue",
    "Lato", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";

*,
*:after,
*:before
  outline: none;

a
  text-decoration: none;

body > div#app
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;

  @media only screen and (max-width: $iPhone-6S-Plus)
    background-color: $header-background-color;
</style>
