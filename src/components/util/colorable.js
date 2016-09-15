import { flatColor, isCssColor } from './colors';

export default {
  props: {
    color: String,
  },

  computed: {
    colorHexCode() {
      if (isCssColor(this.color)) {
        return this.color;
      } else if (flatColor[this.color]) {
        return flatColor[this.color];
      }

      return null;
    },
  },
};
