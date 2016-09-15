<template>
<div class="login-header">
  <transition name="slide-down">
    <div class="avatar" v-show="avatarVisible || $parent.currentView === 'signup'"
      :class="{ signup: $parent.currentView === 'signup' }">

      <img v-show="$parent.currentView !== 'signup' ||
        ($parent.currentView === 'signup' && userImageTaken)"
        :src="avatarUrl" :class="{ flip: userImageTaken }"
        @load="onAvatarImageLoaded()"
        @click="activateCamera()" />

      <button v-show="$parent.currentView === 'signup' && !cameraActive && !userImageTaken"
        class="camera mdi mdi-camera"
        @click="activateCamera()"
        :title="$t('auth.take_photo')">
      </button>

      <ag-cam-snapshot :active="$parent.currentView === 'signup' && cameraActive"
        :delay-camera-stoppage="1500"
        :picture-width="300"
        :picture-height="300"
        v-show="cameraActive"
        v-model="avatarData"
        @countdown="onCountdown(...arguments)"
        @snapshot="onSnapshot()">
      </ag-cam-snapshot>

      <transition name="fade">
        <div class="flash" v-show="flashing"
          @transitionend="onFlashTransitionEnd()">
        </div>
      </transition>
    </div>
  </transition>

  <div v-show="$parent.currentView === 'signup' && cameraActive" class="countdown">
    <div>
      <span :class="{ active: countdown <= 2 }">.</span>
      <span :class="{ active: countdown <= 1 }">.</span>
      <span :class="{ active: countdown <= 0 }">.</span>
    </div>
  </div>

  <div class="banner" :class="{ 'blurred': avatarVisible }">
    <!-- <div class="image-container" v-show="avatarVisible"
      :style="{ backgroundImage: `url(${avatarUrl})` }">
    </div> -->

    <transition name="fade">
      <img class="logo" :class="{ bounce: loading }" src="/assets/logo.svg"
        v-show="!avatarVisible && $parent.currentView !== 'signup'" />
    </transition>
  </div>

  <div class="message warn-message" v-if="!$connected">
    <p>Aplicação em modo offline</p>
  </div>

  <transition name="expand">
  <div class="message" :class="`${message.type}-message`"
    v-for="(message, index) in messages">
    <button class="mdi mdi-close" @click="$emit('message-close', message)"></button>
    <p>{{ $t(message.code) }}</p>
  </div>
  </transition>
</div>
</template>

<script>
import md5 from 'md5';
import AgCamSnapshot from '../../components/ag-cam-snapshot';

export default {
  components: { AgCamSnapshot },
  props: {
    messages: {
      required: true,
      type: Array,
    },
    userEmail: {
      required: false,
      type: String,
    },
    loading: {
      required: false,
      type: Boolean,
      default: false,
    },
    view: {
      required: false,
      type: String,
    },
  },

  data() {
    return {
      avatarLoaded: false,
      avatarData: null,
      cameraActive: false,
      countdownActive: false,
      countdown: 4,
      flashing: false,
      userImageTaken: false,

      _captureInterval: null,
      _userMedia: null,
      _userImageCanvas: null,
    };
  },

  computed: {
    avatarVisible() {
      return this.avatarLoaded
        && this.avatarUrl !== null
        && this.avatarUrl.trim() !== '';
    },

    avatarUrl() {
      if (this.avatarData !== null) {
        return this.avatarData;
      } else if (this.userEmail && this.userEmail.trim() !== '') {
        return `https://secure.gravatar.com/avatar/${md5(this.userEmail)}?s=300&d=mm`;
      }

      return null;
    },
  },

  watch: {
    avatarUrl() {
      this.avatarLoaded = false;
    },

    view(newVal) {
      if (newVal !== 'signup') {
        this.avatarData = null;
        this.userImageTaken = false;
      }
    },
  },

  methods: {
    activateCamera() {
      this.cameraActive = true;
      this.userImageTaken = false;
      this.countdown = 3;
    },

    onAvatarImageLoaded() {
      this.avatarLoaded = true;
    },

    onCountdown(countdown) {
      this.countdown = countdown;

      if (this.countdown === 0) {
        this.$nextTick(() => {
          this.flashing = true;
        });
      }
    },

    onSnapshot() {
      this.userImageTaken = true;
      this.cameraActive = false;
    },

    onFlashTransitionEnd() {
      if (this.flashing) {
        this.flashing = false;
      }
    },
  },

  mounted() {
    this._userImageCanvas = document.getElementById('user-image');
  },
};
</script>

<style lang="stylus">
@require '~components/styles/palette';

@keyframes bounce
  0%
    transform: scale(1.1, 0.85) translateY(5px);
  50%
    transform: scale(1, 1) translateY(-5px);
  100%
    transform: scale(1.1, 0.85) translateY(5px);

.login-header
  text-align: center;

  div.avatar
    background: none;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.3);
    border-radius: 50%;
    display: inline-block;
    height: 80px;
    margin-top: -25px;
    opacity: 1;
    overflow: hidden;
    position: absolute;
    text-align: center;
    transform: translate(-40px, 0px);
    transition: transform .3s ease-in-out,
      opacity .3s ease-in-out;
    width: 80px;
    z-index: 5;

    &.slide-down-enter, &.slide-down-leave-active
      opacity: 0;
      transform: translate(-40px, -15px);

    .flash
      background-color: white;
      height: 120%;
      left: -10%;
      opacity: 1;
      position: absolute;
      top: -10%;
      transition: opacity 0.01s ease-out;
      width: 120%;
      z-index: 999;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

      &.fade-enter-active
        transition-delay: 1s;
        transition-duration: 0.1s;

      &.fade-leave-active
        transition-duration: 1.5s;

    .webcam
      display: inline-block;
      height: 80px;
      margin: 0 -100%;

      > img.snapshot
        display: none;

      > video
        height: 80px;

    img
      background-color: flat-color(belize-hole);
      cursor: pointer;
      height: 80px;
      margin: 0 -100%;

      &[src=""], &:not([src])
        margin: -5px 0 0 -5px;
        height: 100px;
        width: 100px;

      &.flip
        transform: rotateY(180deg);

    .camera
      background-color: flat-color(clouds);
      border: none;
      border-radius: 50%;
      color: lighten(flat-color(wet-asphalt), 40%);
      cursor: pointer;
      font-size: 50px;
      height: 80px;
      line-height: 80px;
      opacity: 1;
      padding: 0;
      transition: opacity 0.2s ease-in-out;
      width: 80px;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

    .photo
      display: flex;
      border-radius: 50%;
      height: 80px;
      width: 80px;
      overflow: hidden;
      transform: rotateY(180deg);

      #webcam
        margin-left: -13px;
        height: 80px;

        video
          height: 80px;

      #user-image
        height: 80px;
        width: 80px;

  .countdown
    color: flat-color(clouds);
    display: inline-block;
    font-size: 50px;
    left: 50%;
    position: absolute;
    user-select: none;

    > div
      left: -50%;
      margin-top: 18px;
      position: relative;

      > span
        transition: color 0.2s ease;

      > .active
        color: flat-color(emerald) !important;

  div.banner
    height: 40px;
    padding: 15px 0 15px 0;
    background-color: flat-color(belize-hole);
    overflow: hidden;

    &.blurred .image-container
      background-position: 50%;
      filter: blur(10px);
      height: 120px;
      margin-top: -40px;
      margin-left: -25%;
      position: relative;
      opacity: 1;
      transition: margin-top .3s ease-in-out,
        opacity .3s ease-in-out;
      width: 150%;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

    .logo
      transition: opacity .3s ease-in-out;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

    img
      height: 40px;
      width: 100%;

      &.bounce
        animation: bounce 1s cubic-bezier(.51,.23,.02,.96) infinite;

  div.message
    align-items: flex-start;
    display: flex;
    max-height: 40px;
    overflow: hidden;
    transition: max-height 0.3s ease-out;

    &.expand-enter, &.expand-leave-active
      max-height: 0;

    &.error-message
      background-color: flat-color('alizarin');

    &.warn-message
      background-color: flat-color('orange');

    &.info-message
      background-color: flat-color('emerald');

    p
      flex-grow: 1;
      flex-shring: 0;
      font-size: 0.8em;
      color: white;
      margin: 0;
      padding: 5px 20px 5px 5px;
      text-align: left;

      #login[data-platform="mac"] &
        padding-left: 20px

    button
      background: none;
      border: none;
      cursor: pointer;
      color: white;
      float: right;
      padding-top: 5px;

      #login[data-platform="mac"] &
        order: 2
        padding-right: 5px;


      &:hover, &:focus
        color: flat-color('silver');
</style>
