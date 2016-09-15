<script>
import DialogPolyfill from 'dialog-polyfill';

import './util/dialog-detection';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close() {
      if (this.$el.hasAttribute('open')) {
        // Dialog close fading animation
        this.$el.classList.add('closing');
        setTimeout(() => {
          this.$el.close();
          this.$emit('close');
          this.$el.classList.remove('closing');
        }, 300);
      }

      if (!this.$isServer && document.body.querySelector('dialog[open]') === null) {
        this.$root.$el.classList.remove('dialog-visible');
      }
    },
  },

  watch: {
    show(isShown) {
      if (this.$isServer) return;

      if (isShown) {
        this.$root.$el.classList.add('dialog-visible');
        this.$el.showModal();

        // Autofocus the first input only if we have a non-touch screen.
        // This isn't very reliable, but covers enough main cases.
        if (!this.$isServer && !document.documentElement.classList.contains('touchevents') &&
          !window.matchMedia('(pointer: coarse)').matches) {
          this.$nextTick(() => {
            this.$el.getElementsByTagName('INPUT')[0].focus();
          });
        }
      } else {
        this.close();
      }
    },
  },

  // created() {
  //   this.$el.classList.add('opening');
  // },

  mounted() {
    if (!this.$isServer) {
      /* eslint-disable global-require */
      DialogPolyfill.registerDialog(this.$el);
    }

    this.$el.addEventListener('close', (event) => {
      event.preventDefault();
      this.close();
    });

    this.$el.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });

    if (navigator.platform.startsWith('Mac')) {
      this.$el.setAttribute('data-platform', 'mac');
    } else {
      this.$el.setAttribute('data-platform', 'other');
    }

    setTimeout(() => {
      this.$el.classList.remove('opening');
    }, 300);
  },
};
</script>

<style lang="stylus">
@require './styles/devices';

@keyframes ag-dialog-fade-in
  from
    opacity: 0;
  to
    opacity: 1;

@keyframes ag-dialog-fade-out
  from
    opacity: 1;
  to
    opacity: 0;

.no-dialog dialog
  display: none;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  right: 0;
  position: absolute;

  &[open]
    display: block;

  & + .backdrop
    background: radial-gradient(circle, rgba(0,0,0,0.5), rgba(0,0,0,0.8))
    height: 100vh;
    left: 0;
    top: 0;
    width: 100vw;
    position: absolute;

dialog
  background: transparent;
  box-shadow: 5px 10px 35px rgba(0, 0, 0, 0.4);
  border: none;
  padding: 0;
  position: fixed;
  text-align: center;
  transition: opacity .4s ease-out;

  .no-cssanimations &
    opacity: 1;

  @media only screen and (max-width: $iPhone-6S-Plus),
  only screen and (orientation: landscape) and (max-height: $iPhone-6S-Plus)
    box-shadow: none;
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;

    .no-dialog &
      left: 0;
      top: 0;
      transform: none;

  &::backdrop
    background: radial-gradient(circle, rgba(0,0,0,0.5), rgba(0,0,0,0.8));

  @media only screen and (min-width: $iPhone-6S-Plus) and (orientation: portrait)
    @supports (backdrop-filter: none)
      &::backdrop, & + .backdrop
        backdrop-filter: blur(5px) grayscale(100%);
        transistion: backdrop-filter 0.3s ease-in-out;

  &[open]
    animation: ag-dialog-fade-in 0.3s ease-in forwards;

    &::backdrop, & + .backdrop
      animation: ag-dialog-fade-in 0.3s ease-in forwards;

    &.closing
      animation: ag-dialog-fade-out 0.3s ease-in-out forwards;

      &::backdrop, & + .backdrop
        animation: ag-dialog-fade-out 0.3s ease-in-out forwards;

// Blur and turn into monochrome the body contents when a dialog is visible
@media only screen and (min-width: $iPhone-6S-Plus)
  @supports not (backdrop-filter: none)
    #app > *:not(dialog):not(.backdrop)
      transition: filter 0.3s ease-in-out;

    #app.dialog-visible > *:not(dialog):not(.backdrop)
      filter: grayscale(100%);

@media only screen and (max-width: $iPhone-6S-Plus),
only screen and (orientation: landscape) and (max-height: $iPhone-6S-Plus)
  #app.dialog-visible
    overflow: hidden;

  #app.dialog-visible > *:not(dialog):not(.backdrop)
    display: none;
</style>
