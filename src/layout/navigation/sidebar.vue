<template>
<nav>
  <!-- <main-menu></main-menu>
  <my-shelves></my-shelves>
  <resume-lesson></resume-lesson> -->
</nav>
</template>

<script>
// import MainMenu from './main-menu';
// import MyShelves from './my-shelves';
// import ResumeLesson from './resume-lesson';

export default {
  // components: {
  //   MainMenu,
  //   MyShelves,
  //   ResumeLesson,
  // },
};
</script>

<style lang="stylus">
@require '~components/styles/devices';
@require '~components/styles/palette';

nav
  background-color: flat-color(clouds);
  box-sizing: border-box;
  order: 1;
  padding: 20px 0 20px 0;

  @media only screen and (max-width: $iPhone-6S-Plus)
    box-shadow: inset -8px 0 5px -5px rgba(0, 0, 0, 0.2);
    height: 100vh;
    padding: 10px 0 10px 0;
    position: fixed;

    & .resume-lesson
      display: none !important;

  @media only screen and (min-width: $iPhone-6S) and (max-width: $iPhone-6S-Plus)
    font-size: 1.2em;

  & > div > a
    border-left: 3px solid transparent;
    box-sizing: border-box;
    color: lighten(flat-color(wet-asphalt), 10%);
    margin-left: 1px;
    padding: 5px 20px 5px 16px;
    transition: background-color 0.2s ease, color 0.1s ease;

    &:focus, &:hover
      color: flat-color(concrete);

    &:active
      color: lighten(flat-color(wet-asphalt), 10%);

    &.router-link-active
      color: flat-color(peter-river);
      border-left-color: flat-color(peter-river);

    @media only screen and (max-width: $iPhone-6S-Plus)
      padding: 5px 16px 5px 16px;
      margin-left: 0px;

      &:active, &.router-link-active
        background-color: flat-color(peter-river);
        border-left-color: transparent !important;
        box-shadow: inset -8px 0 5px -5px rgba(0, 0, 0, 0.2);
        color: white !important;

  .ag-aside-section
    margin: 20px 20px 5px 20px;

    &:first-child
      margin-top: 0;

    h1
      color: flat-color(concrete)

    hr
      background-color: darken(flat-color(clouds), 5%);

    @media only screen and (max-width: $iPhone-6S-Plus)
      background-color: darken(flat-color(clouds), 10%);
      box-shadow: inset -8px 0 5px -5px rgba(0, 0, 0, 0.2);
      padding: 0px 20px 0px 20px;
      margin: 10px 0 10px 0;

      hr
        background-color: transparent;
</style>
