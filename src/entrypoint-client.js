import Promise from 'es6-promise';

import { app, auth, store } from './main';
import i18n from './components/i18n';

Promise.polyfill();

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
store.replaceState(window.__INITIAL_STATE__);

i18n.locale('pt-BR');
i18n.replace(window.__I18N_PHRASES__);

auth.push(window.location.search.substring(1));

// actually mount to DOM
app.$mount('#app');
