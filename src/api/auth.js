import axios from 'axios';

import config from '../config';
import inBrowser from '../components/util/in-browser';

/**
 * Retrieve a parameter from the URL's query fragment.
 *
 * @param   {String} variable The name of the variable to be retrieved.
 * @param   {String} query    The URL string to be parsed.
 * @returns {String}          The variable's value or false if the variable isn't
 *                            present at the URL.
 */
function getQueryParameter(variable, query = '') {
  const vars = query.split('&');

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return false;
}

/**
 * The authentication resource.
 */
export default class Auth {
  constructor() {
    this._token = null;
    this._user = null;
  }

  parseTokenQueryParam() {
    return getQueryParameter('id_token', this.query);
  }

  push(url) {
    this.query = url.substring(url.lastIndexOf('?'));
    this.init(this.app);
  }

  init(app) {
    this.app = app;

    if (this.parseTokenQueryParam()) {
      this.token = this.parseTokenQueryParam();
      if (inBrowser) {
        window.location.search = '';
      }
    }

    if (this.token) {
      axios.get(`${config.server.rest}/me`, {
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      }).then((profile) => {
        this.user = profile.data;
      });
    }
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      if (this.user) {
        resolve(this.user);
        return;
      }

      axios.post(`${config.server.rest}/login/identity/callback`,
        { email: username, password })
        .then((response) => {
          this.token = response.data.jwt;

          return axios.get(`${config.server.rest}/me`, {
            headers: {
              authorization: `Bearer ${this.token}`,
            },
          });
        })
        .then((profile) => {
          this.user = profile.data;
          resolve(this.user);
        })
        .catch((error) => reject({ message: error.response.data.reason }));
    });
  }

  logout() {
    this.user = null;
    this.token = null;
  }

  signup(fullname, username, password) {
    return new Promise((resolve, reject) => {
      if (this.user) {
        resolve(this.user);
        return;
      }

      axios.post(`${config.server.rest}/login/signup`,
        { fullname, email: username, password })
        .then((response) => {
          this.token = response.data.jwt;

          return axios.get(`${config.server.rest}/me`, {
            headers: {
              authorization: `Bearer ${this.token}`,
            },
          });
        })
        .then((profile) => {
          this.user = profile.data;
          resolve(this.user);
        })
        .catch((error) => reject({ message: error.response.data.reason }));
    });
  }

  oAuthLogin(provider) {
    if (['facebook', 'google'].indexOf(provider) >= 0) {
      window.location.href = config.server.loginUrl.replace(/:provider$/, provider);
    } else {
      throw new Error('provider_not_supported');
    }
  }

  get user() {
    return this.app._user;
  }

  set user(user) {
    this._user = user;
    this.app._user = user;
  }

  get token() {
    if (this._token) {
      return this._token;
    }

    if (inBrowser) {
      const token = localStorage.getItem('idToken');
      if (token !== null) {
        this._token = token;
        return token;
      }
    }

    return null;
  }

  set token(token) {
    if (inBrowser) {
      if (token !== null) {
        localStorage.setItem('idToken', token);
      } else {
        localStorage.removeItem('idToken');
      }
    }

    this._token = token;
  }

  static install(Vue) {
    Vue.mixin({
      computed: {
        $auth() {
          return this.$root._auth;
        },

        $user() {
          return this.$root._user;
        },
      },

      beforeCreate() {
        if (this.$options.auth) {
          this._auth = this.$options.auth;
          this._auth.init(this);

          Vue.util.defineReactive(this, '_user', this._auth.user);
        }
      },
    });
  }
}

