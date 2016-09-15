<template>
  <header class="logo-visible">
    <div id="actions-panel">
      <menu-toggle :active="navActive" @click.native="$emit('toggle-nav')"></menu-toggle>
      <search-field
        :active="searchActive"
        @click="toggleSearch()"
        @close="onSearchClose()">
      </search-field>
    </div>

    <transition name="fade" @after-leave="onLogoLeave()" @before-enter="onLogoEnter()">
      <div id="logo" v-if="logoVisible">
        <img src="/assets/logo.svg" />
      </div>
    </transition>

    <div id="user">
      <user-menu v-if="$user"></user-menu>
      <button class="open-login-dialog" @click="$emit('login')"
        :title="$t('header.signin')" v-if="!$user && $connected">
        {{ $t('header.signin') }}
      </button>
    </div>
  </header>
</template>

<script>
import AgFlatButton from '../components/ag-flat-button';

import MenuToggle from './header/menu-toggle';
import SearchField from './header/search-field';
import UserMenu from './header/user-menu';

import Config from '../config';

export default {
  components: {
    AgFlatButton,

    MenuToggle,
    SearchField,
    UserMenu,
  },

  props: {
    navActive: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      searchActive: false,
      logoVisible: true,
      _resize: false,
    };
  },

  mounted() {
    document.ontouchmove = (event) => {
      if (this.navActive && window.innerWidth <= Config.devices['iPhone-6S-Plus']) {
        event.preventDefault();
      }
    };

    window.addEventListener('resize', () => {
      clearTimeout(this._data._resize);
      this._data._resize = setTimeout(() => {
        if (this.logoVisible === this.searchActive
          && this.searchActive === true
          && window.innerWidth <= Config.devices['iPhone-6S-Plus']) {
          this.logoVisible = false;
          this.$el.classList.remove('logo-visible');
        }

        if (this.logoVisible !== this.searchActive
          && this.searchActive === true
          && window.innerWidth > Config.devices['iPhone-6S-Plus']) {
          this.logoVisible = true;
          this.$el.classList.add('logo-visible');
        }
      }, 250);
    });
  },

  methods: {
    destroyCurrentSession() {
      // auth.removeToken();
      this.setProfile(null);
    },

    toggleSearch() {
      if (window.innerWidth <= Config.devices['MS-Surface-Pro']) {
        if (this.searchActive) {
          this.searchActive = false;
        } else {
          this.logoVisible = false;
        }
      } else {
        this.searchActive = !this.searchActive;
      }
    },

    onLogoEnter() {
      if (this.$el) {
        this.$el.classList.add('logo-visible');
      }
    },

    onLogoLeave() {
      this.searchActive = true;
      this.$el.classList.remove('logo-visible');
    },

    onSearchClose() {
      this.logoVisible = true;
    },
  },
};
</script>

<style lang="stylus">
@require "~components/styles/devices";
@require "~components/styles/palette";

$header-background-color = flat-color(belize-hole);

body > div#app > header
  // background: darken(flat-color(belize-hole), 30%);
  background: $header-background-color;
  display: flex;
  flex: 0 0 auto;
  height: 30px;
  padding: 7px 20px 7px 20px;

  > div
    display flex;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;

  > div#actions-panel
    > .menu-toggle
      flex-shrink: 0;
      margin-right: 10px;

    .search-field
      max-width: 350px;

  > div#logo
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    justify-content: center;
    opacity: 1;
    padding-left: 5px;
    padding-right: 5px;
    transition: opacity .2s ease;

    &.fade-enter, &.fade-leave-active
      opacity: 0;

    img
      height: 30px;
      width: 100px;

  > div#user
    flex-direction: row-reverse;
    flex-shrink: 0;

    .open-login-dialog
      background: none;
      border: 1px solid white;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      font-size: 0.6em;
      padding: 5px 10px 5px 10px;
      text-transform: uppercase;

  @media only screen and (max-width: $MS-Surface-Pro)
    width: calc(100% - 40px);
    position: fixed;
    z-index: 2;

    &:not(.logo-visible)
      #actions-panel
        /*flex-grow: 5;*/

        .search-field
          max-width: inherit;
          margin-right: 20px;

      #logo
        display: none;

      #user
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

  @media only screen and (min-width: $MS-Surface-Pro + 1)
    #logo
      opacity: 1 !important;
</style>
