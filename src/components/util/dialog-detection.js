import inBrowser from './in-browser';

if (inBrowser && typeof HTMLDialogElement === 'function') {
  document.documentElement.classList.remove('no-dialog');
}
