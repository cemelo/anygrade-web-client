import { Socket, LongPoll } from 'phoenix';
import config from '../config';

export default class Phoenix {
  static install(Vue) {
    const socket = new Socket(config.server.url,
      {
        transport: WebSocket || LongPoll,
        ...config.server.params,
      });

    Vue.mixin({
      computed: {
        $phoenix() {
          return this.$root._phoenix;
        },

        $connected() {
          return this.$root._connected;
        },
      },

      beforeCreate() {
        if (this.$options.phoenix) {
          this._phoenix = socket;
          this._phoenix.connect();

          this._phoenix.onOpen(() => { this._connected = true; });
          this._phoenix.onClose(() => { this._connected = false; });
          this._phoenix.onError(() => { this._connected = false; });

          Vue.util.defineReactive(this, '_connected', false);
        }
      },
    });
  }
}
