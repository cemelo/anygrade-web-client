<template>
  <div id="container">
    <div id="content" :class="{ 'navigation-visible': navActive }">
      <router-view></router-view>
      <navigation-sidebar></navigation-sidebar>
    </div>
  </div>
</template>

<script>
import NavigationSidebar from './navigation/sidebar';

export default {
  components: { NavigationSidebar },

  props: {
    navActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
};
</script>

<style lang="stylus">
@require "~components/styles/devices";
@require "~components/styles/palette";

body > div#app > div#container
  align-self: stretch;
  display: flex;
  flex: 1 0 auto;
  overflow-x: hidden;

  div#content
    align-self: stretch;
    display: flex;
    flex: 1 0 auto;
    transition: width 0.3s ease-in-out;
    width: 100%;

    @media screen and (max-width: $iPhone-6S-Plus)
      overflow: hidden;

      &.navigation-visible
        width: 180%;

    @media only screen and (max-width: $iPhone-6S-Plus)
      & > *:not(nav)
        transition: margin-left 0.3s ease-in-out;

      &.navigation-visible > *:not(nav)
        margin-left: 80%;
        margin-left: 80vw;

    @media only screen and (max-width: $MS-Surface-Pro)
      background-color: white;
      margin-top: 44px;

    @media screen and (min-width: $iPhone-6S-Plus) and (max-width: $iPad)
      &.navigation-visible
        width: calc(100vw + 200px);

    > *
      align-self: stretch;

    > nav, > div
      overflow: hidden;
      flex-shrink: 0;

    > div
      display: flex;
      flex-basis: 0;
      flex-grow: 1;
      order: 2;
      overflow: hidden;
      padding: 20px;

      > main
        flex-basis: 0;
        flex-grow: 1;
        order: 1;

      > aside
        order: 2;
        width: 200px;

        @media screen and (max-width: $iPhone-6S-Plus)
          display: none;

    > nav
      background-color: flat-color(clouds);
      margin-left: -200px;
      order: 1;
      transition: transform 0.3s ease-in-out;
      transition: margin-left 0.3s ease-in-out;
      width: 200px;

      @media screen and (max-width: $iPhone-6S-Plus)
        margin-left: -80%;
        margin-left: -80vw;
        width: 80%;
        width: 80vw;

    &.navigation-visible > nav
      margin-left: 0px;
</style>
