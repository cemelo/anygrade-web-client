import Vue from 'vue';
import Polyglot from 'node-polyglot';

const polyglot = new Polyglot();

class I18n {

  replace(phrases) {
    polyglot.replace(phrases);
  }

  locale(lc) {
    polyglot.locale(lc);
  }

  /* eslint-disable no-param-reassign, no-shadow */
  static install(Vue) {
    if (!Vue.prototype.$t) {
      Vue.prototype.$t = function translate(key, params = {}) {
        if (polyglot) {
          return polyglot.t(key, params);
        }

        return key;
      };
    }
  }
}

Vue.use(I18n);

export default new I18n();
