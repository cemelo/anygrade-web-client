<template>
  <div class="ag-dropdown">
    <span class="label" @click.stop="toggle()">
      <span>
        <span v-if="imageClass" :class="imageClass"></span>
        <span>{{ label }}</span>
      </span>
      <span class="mdi"
        :class="{ 'mdi-chevron-down': !active, 'mdi-chevron-up': active }"></span>
    </span>
    <transition name="expand">
      <ul class="dropdown" v-show="active">
        <li class="option"
          v-for="option in options" @click.stop="select(option)">
          <span v-if="option.imageClass" :class="option.imageClass"></span>
          <span>{{ option.label }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import LayerStack from './util/layer-stack';

export default {
  props: {
    options: {
      type: Array,
      required: true,
    },

    value: {
      required: true,
    },
  },

  data() {
    return {
      label: 'Select',
      imageClass: null,
      active: false,
    };
  },

  mounted() {
    for (const option of this.options) {
      if (option.selected) {
        this.label = option.label;
        this.imageClass = option.imageClass;
        break;
      }
    }
  },

  methods: {
    toggle() {
      this.active = !this.active;

      if (!this.$isServer && this.active) {
        LayerStack.push(this.$el, () => { this.active = false; });
      }
    },

    select(option) {
      if (!this.$isServer) LayerStack.pop();
      this.active = false;

      this.label = option.label;
      this.imageClass = option.imageClass;
      this.$emit('input', option.value);
    },
  },
};
</script>

<style lang="stylus">
@require './styles/palette';

.ag-dropdown
  display: inline-block;

  .label
    cursor: default;
    user-select: none;

  .dropdown
    background: flat-color(clouds);
    border-radius: 5px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    color: flat-color(asbestos);
    list-style-type: none;
    margin: 5px 0 0 0;
    opacity: 1;
    padding: 0;
    position: absolute;
    transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
    transform-origin: top;
    user-select: none;

    &.expand-enter, &.expand-leave-active
      opacity: 0;

    .option
      padding: 5px 10px 5px 10px;
      whitespace: nowrap;

      &:first-child
        border-top: none;

      &:hover
        background-color: flat-color(belize-hole);
        border-color: transparent;
        color: white;

</style>
