import Element from './element';
import Window from './window';

import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class FauxDOM {
  constructor(private r: Renderer2) {
    if (!Element.prototype.ownerDocument)
      Element.prototype.ownerDocument = this;
  }
  Element = Element;
  defaultView = Window;

  createElement(nodeName) {
    return this.r.createElement(nodeName);
    //return new Element(nodeName);
  }
  createElementNS(namespace, nodeName) {
    return this.createElement(nodeName);
  }
  compareDocumentPosition() {
    // The selector engine tries to validate with this, but we don't care.
    // 8 = DOCUMENT_POSITION_CONTAINS, so we say all nodes are in this document.
    return 8;
  }
}
