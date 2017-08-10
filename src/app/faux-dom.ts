import Element from './element';
import Window from './window';

const FauxDOM = {
  Element: Element,
  defaultView: Window,
  createElement: function (nodeName) {
    return new Element(nodeName);
  },
  createElementNS: function (namespace, nodeName) {
    return this.createElement(nodeName);
  },
  compareDocumentPosition: function () {
    // The selector engine tries to validate with this, but we don't care.
    // 8 = DOCUMENT_POSITION_CONTAINS, so we say all nodes are in this document.
    return 8;
  }
};

Element.prototype.ownerDocument = FauxDOM;

export default FauxDOM;
