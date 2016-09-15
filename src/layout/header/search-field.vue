<template>
<div class="search-field">
  <button class="search-toggle mdi mdi-magnify"
    :class="{ 'open': active }"
    :title="$t('header.search.title')"
    @click="$emit('click')">
  </button>

  <transition name="fade-slide" @after-leave="$emit('close')">
  <div class="search-box" v-show="active">
    <input class="search-text" :placeholder="$t('header.search.placeholder')"
      v-model="searchTerms" />
    <button class="search-audio-input mdi mdi-microphone"
      :title="$t('header.search.audio_input')"></button>
  </div>
  </transition>

  <transition name="fade">
  <div class="search-results" v-show="active && showResults">
    <transition name="fade">
      <div class="loading" v-show="results.length === 0">
        <ag-spinner color="clouds" :circles="3"></ag-spinner>
      </div>
    </transition>

    <transition name="fade">
      <div class="results" v-show="results.length > 0">
        <div class="result" v-for="result in results">
          Blablabla
        </div>
      </div>
    </transition>
  </div>
  </transition>
</template>

<script>
import AgSpinner from '../../components/ag-spinner';

export default {
  components: { AgSpinner },
  props: {
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      searchTerms: '',
      results: [],
    };
  },

  computed: {
    showResults() {
      return this.searchTerms !== null && this.searchTerms.trim() !== '';
    },
  },

  methods: {
  },

  watch: {
    active(newValue) {
      if (newValue) {
        this.$nextTick(() => this.$el.getElementsByTagName('INPUT')[0].focus());
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@require '~components/styles/devices';
@require '~components/styles/palette';

$base-color = flat-color(belize-hole);
$results-color = flat-color(wet-asphalt);

.search-field
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;

  .search-toggle
    background: transparent;
    border: none;
    box-sizing: border-box;
    color: white;
    cursor: pointer;
    font-size: 1.375em;
    height: 28px;
    margin-top: 1px;
    padding: 3px 0px 3px 0px;
    transition: background-color 0.3s ease-in-out;
    width: 28px;

    &.open
      background-color: darken($base-color, 20%);
      transition-delay: 0s;

    &:active
      color: darken(white, 20%);

  .search-box
    align-items: center;
    border-bottom: 1px solid darken($base-color, 20%);
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    margin-left: 0 !important;
    margin-top: 1px;
    vertical-align: middle;
    opacity: 1;
    padding: 0 0 0 10px;
    transform: scaleX(1);
    transform-origin: left;
    transition: padding 0.6s ease-in-out,
      opacity 0.3s ease-in-out;

    &.fade-slide-enter, &.fade-slide-leave-active
      opacity: 0;
      padding: 0;

    & > input.search-text
      border: none;
      background: transparent;
      color: white;
      font-weight: 100;
      font-size: 0.8em;
      height: 20px;
      width: 60%;
      flex-grow: 1;
      flex-basis: 0;

      &::placeholder
        color: white;
        opacity: 0.5;
        font-style: italic;
        font-weight: 200;

    & > button.search-audio-input
      background: transparent;
      border: none;
      cursor: pointer;
      color: white;
      font-size: 1.375em;
      opacity: 0.5;
      padding: 0;
      transition: background-color 0.3s ease-in-out 0.1s,
        opacity 0.2s ease-in-out 0s;

      &:hover
        opacity: 1;

      &:active
        opacity: 0.5;

  .search-results
    position: absolute;
    background-color: $results-color;
    margin-top: 36px;
    max-width: 400px;
    width: calc(100vw - 58px);
    max-height: 400px;
    height: calc(100vh - 44px);
    z-index: 2;
    opacity: 1;
    transform-origin: top;
    transform: scaleY(1);
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;

    &:before
      border-bottom: 5px solid $results-color; //darken(flat-color(belize-hole), 20%);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      content: "";
      margin-left: 10px;
      margin-top: -5px;
      position: absolute;
      left: 0;
      top: 0%;
      z-index: 5;

    &.fade-enter, &.fade-leave-active
      opacity: 0;
      transform: scaleY(0);

    .loading
      display: flex;
      align-items: center;
      justify-items: center;
      height: 100%;
      width: 100%;
      opacity: 1;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

      .spinner
        margin: 0 auto;

    // @media only screen and (max-width: $iPhone-6S-Plus)
      // border: 1px solid black;
      // display: inline-block
      // background-color: flat-color(belize-hole);
      // position: absolute;
      // margin-top: 76px;
      // right: 0;
</style>
