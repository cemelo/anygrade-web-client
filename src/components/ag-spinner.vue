<template>
<div class="spinner">
  <div class="bounce1" v-bind:style="{ backgroundColor: colorHexCode }"></div>
  <div class="bounce2" v-if="circles >= 3"
    v-bind:style="{ backgroundColor: colorHexCode }"></div>
  <div class="bounce3" v-if="circles >= 2"
    v-bind:style="{ backgroundColor: colorHexCode }"></div>
</div>
</template>

<script>
import Colorable from './util/colorable';

export default {
  mixins: [Colorable],
  props: {
    color: {
      type: String,
      default: 'clouds',
    },
    circles: {
      type: Number,
      default: 2,
    },
  },
};
</script>

<style lang="stylus">
.spinner
  margin: 100px auto 0;
  width: 70px;
  text-align: center;

  > div
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    border-radius: 100%;
    display: inline-block;
    height: 18px;
    width: 18px;

  .bounce1
    animation-delay: -0.32s;

  .bounce2
    animation-delay: -0.16s;

  .bounce3
    animation-delay: -0s;

@keyframes sk-bouncedelay
  0%, 80%, 100%
    transform: scale(0);
  40%
    transform: scale(1.0);
</style>
