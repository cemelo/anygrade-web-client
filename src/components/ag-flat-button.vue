<!--
Flat Button Component

@author Carlos Eduardo Melo <ceduardo.melo@redime.com.br>
@since 0.1, 22/08/2016
-->
<template>
  <button class="ag-flat-button" :class="classes" :disabled="disabled"
    @click.native="$dispatch('click')">
    <span class="button-content">
      <span class="image mdi" :class="`mdi-${image}`" v-if="image !== undefined"></span>
      <span class="text" :style="{ textAlign: textAlign }">
        <slot></slot>
      </span>
    </span>
  </button>
</template>

<script>
import { isCssColor, shadeBlendConvert } from './util/colors';

export default {
  props: {
    color: String,

    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    image: String,
    imagePosition: String,

    kind: {
      type: String,
      default: 'flat',
      required: false,
    },

    shadow: {
      type: Boolean,
      default: true,
      required: false,
    },

    textAlign: String,
  },

  computed: {
    classes() {
      return [
        this.color ? `color-${this.color}` : '',
        this.kind,
        {
          'button-with-image': this.image !== undefined,
          'image-right': this.imagePosition === 'right',
          disabled: this.disabled,
          shadow: this.shadow,
        },
      ];
    },
  },

  mounted() {
    if (isCssColor(this.color)) {
      if (this.$el.classList.contains('outline')) {
        this.$el.children[0].style.borderColor = this.color;
        this.$el.children[0].style.color = this.color;
      } else {
        this.$el.children[0].style.backgroundColor = this.color;
      }

      this.$el.addEventListener('mouseenter', () => {
        if (this.$el.classList.contains('outline')) {
          this.$el.children[0].style.borderColor = shadeBlendConvert(0.2, this.color);
          this.$el.children[0].style.color = shadeBlendConvert(0.2, this.color);
        } else {
          this.$el.children[0].style.backgroundColor = shadeBlendConvert(0.2, this.color);
        }
      });

      this.$el.addEventListener('mouseleave', () => {
        if (this.$el.classList.contains('outline')) {
          this.$el.children[0].style.borderColor = this.color;
          this.$el.children[0].style.color = this.color;
        } else {
          this.$el.children[0].style.backgroundColor = this.color;
        }
      });

      this.$el.addEventListener('mousedown', () => {
        if (this.$el.classList.contains('outline')) {
          this.$el.children[0].style.borderColor = shadeBlendConvert(-0.2, this.color);
          this.$el.children[0].style.color = shadeBlendConvert(-0.2, this.color);
        } else {
          this.$el.children[0].style.backgroundColor = shadeBlendConvert(-0.2, this.color);
        }
      });

      this.$el.addEventListener('mouseup', () => {
        if (this.$el.classList.contains('outline')) {
          this.$el.children[0].style.borderColor = shadeBlendConvert(0.2, this.color);
          this.$el.children[0].style.borderColor = shadeBlendConvert(0.2, this.color);
        } else {
          this.$el.children[0].style.backgroundColor = shadeBlendConvert(0.2, this.color);
        }
      });
    }
  },
};
</script>

<style lang="stylus">
@require './styles/palette';

button.ag-flat-button
  background: none;
  border: none;
  padding: 0;
  margin: 0;

  & > .button-content
    align-items: center;
    border-radius: 3px;
    color: white;
    display: flex;
    font-size: 0.8em;
    font-weight: 600;
    padding: 0.313em 0.625em 0.313em 0.625em;
    text-transform: uppercase;

  &.outline
    > .button-content
      border-width: 1px;
      border-style: solid;
      font-weight: 400;

  &.shadow > .button-content
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);

  &:not(.shadow) > .button-content
    padding: 0.45em 0.625em 0.45em 0.625em;

  &:active:not(.disabled)
    padding-top: 2px;

    &.shadow > .button-content
      box-shadow: none;
      border-bottom: none;
      // padding-bottom: calc(0.313em - 2px);

    &:not(.shadow) > .button-content
      padding-bottom: calc(0.45em - 2px);

  & .text
    padding-top: 0.08em;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.3);

  &.outline .text
    padding-top: 0;
    text-shadow: none;

  & > .button-content

    & > .image
      flex: 0 1 auto;
      width: 1.2em;
      margin-top: 0.08em;

    & > .text
      flex: 1 0 auto;

  &.button-with-image
    &.flat .button-content
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.15) 2.4em, rgba(0, 0, 0, 0) 2.4em);

    & .text
      margin-left: 1.2em;
      margin-right: 0;

    &.flat.image-right .button-content
      background-image: linear-gradient(to left, rgba(0, 0, 0, 0.15) 2.4em, rgba(0, 0, 0, 0) 2.4em);

      & .text
        padding-right: 1.4em;
        margin-left: 0.313em;
        text-align: right;

      & .image
        order: 2;

  for $color-name, $color-value in $flat-colors
    &.color-{$color-name}
      &.flat
        .button-content
          background-color: $color-value;

        &:hover .button-content, &:focus .button-content
          background-color: lighten($color-value, 20%);

        &:active .button-content
          background-color: darken($color-value, 20%);

      &.outline
        .button-content
          border-color: $color-value;
          color:  $color-value;

        &:hover .button-content, &:focus .button-content
          border-color: lighten($color-value, 20%);
          color:  lighten($color-value, 20%);

        &:active .button-content
          border-color: darken($color-value, 20%);
          color:  darken($color-value, 20%);


  &.disabled, &.disabled:hover, &.disabled:focus, &.disabled:active
    &.flat .button-content
      background-color: flat-color('silver');

    .outline
      border-color: flat-color('silver');
</style>
