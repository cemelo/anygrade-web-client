import phrases from 'locale';

import { app, auth, router, store } from './main';
import i18n from './components/i18n';

const isDev = process.env.NODE_ENV !== 'production';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default (context) => {
  // set router's location
  router.push(context.url);

  // set auth's url
  auth.push(context.url);

  // set localized messages
  i18n.replace(phrases);

  const start = isDev && Date.now();

  // Call preFetch hooks on components matched by the route.
  // A preFetch hook dispatches a store action and returns a Promise,
  // which is resolved when the action is complete and store state has been
  // updated.

  /* eslint-disable consistent-return, array-callback-return */
  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.preFetch) {
      return component.preFetch(store);
    }
  })).then(() => {
    if (isDev) console.log(`Data pre-fetch time: ${Date.now() - start}ms`);
    // After all preFetch hooks are resolved, our store is now
    // filled with the state needed to render the app.
    // Expose the state on the render context, and let the request handler
    // inline the state in the HTML response. This allows the client-side
    // store to pick-up the server-side state without having to duplicate
    // the initial data fetching on the client.
    /* eslint-disable no-param-reassign */
    context.initialState = store.state;
    context.localePhrases = phrases;

    return app;
  });
};
