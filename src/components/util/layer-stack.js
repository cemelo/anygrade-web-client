import inBrowser from './in-browser';

/**
 * Controls the document layer stack.
 */
class LayerStack {
  constructor() {
    if (!inBrowser) return;

    this._stack = [];
    document.documentElement.addEventListener('click', (event) => {
      if (this._stack.length === 0) return;

      const layer = this._stack.pop();
      if (!layer(event)) {
        this._stack.push(layer);
      }
    });
  }

  push(element, callback) {
    if (!inBrowser) return;

    this._stack.push((event) => {
      const containsNode = (element.compareDocumentPosition(event.target) &
        Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY;

      if (element === event.target || containsNode) return false;

      callback();
      return true;
    });
  }

  pop() {
    if (!inBrowser) return;

    this._stack.pop();
  }
}

export default new LayerStack();
