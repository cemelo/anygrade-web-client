/**
 * Flag determining if the current execution context is within the browser.
 */
export default (typeof window !== 'undefined'
  && Object.prototype.toString.call(window) !== '[object Object]');
