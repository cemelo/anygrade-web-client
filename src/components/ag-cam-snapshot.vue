<template>
  <div class="webcam">
    <video v-show="cameraActive"></video>
    <canvas style="display: none;"></canvas>
    <img class="snapshot" v-show="snapshotTaken" />
  </div>
</template>

<script>
import {
  getUserMedia,
  streamToElement,
  stopStream,
} from './user-media';

export default {
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    delayCameraStoppage: {
      type: Number,
      required: false,
    },
    pictureHeight: {
      type: Number,
      required: false,
      default: 720,
    },
    pictureWidth: {
      type: Number,
      required: false,
      default: 1280,
    },
    value: {
      required: false,
    },
  },

  watch: {
    active(newVal) {
      if (newVal) {
        this.cameraActive = true;

        const opts = {
          audio: false,
          video: {
            width: this.pictureWidth,
            height: this.pictureHeight,
          },
        };

        getUserMedia(opts)
          .then((stream) => {
            this.stream = stream;
            return streamToElement(this.$el.getElementsByTagName('video')[0], stream);
          })
          .then((/* videoEl */) => {
            this._countdownInterval = setInterval(() => this.startCountdown(), 1000);
          });
      } else if (this.stream) {
        if (this.delayCameraStoppage) {
          setTimeout(() => stopStream(this.stream),
            this.delayCameraStoppage);
        } else {
          stopStream(this.stream);
        }
      }
    },
  },

  methods: {
    startCountdown() {
      if (this.countdown > 0) {
        this.countdown = this.countdown - 1;
        this.$emit('countdown', this.countdown);
      } else {
        clearInterval(this._countdownInterval);
        this.countdown = 3;
        this.takeSnapshot();
      }
    },

    takeSnapshot() {
      this.cameraActive = false;
      this.snapshotTaken = true;

      const canvas = this.$el.getElementsByTagName('canvas')[0];
      const video = this.$el.getElementsByTagName('video')[0];
      const image = this.$el.getElementsByTagName('img')[0];

      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const data = canvas.toDataURL('image/png');
      image.src = data;

      this.$emit('input', data);
      this.$emit('snapshot');
    },
  },

  data() {
    return {
      countdown: 3,
      stream: null,

      cameraActive: true,
      snapshotTaken: false,

      _countdownInterval: null,
    };
  },
};
</script>

<style lang="stylus">
.webcam > video
  transform: rotateY(180deg);
</style>
