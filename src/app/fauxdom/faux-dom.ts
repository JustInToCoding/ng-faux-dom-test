import Window from './window';

import { Renderer2 } from '@angular/core';

export class FauxDOM {

  Element: any;
  defaultView = Window;

  constructor(private r: Renderer2) {
    this.Element = this.r.createElement('div').__proto__;
  }

  createElement(nodeName): any {
    return this.r.createElement(nodeName);
  }

  createElementNS(namespace, nodeName): any {
    return this.r.createElement(nodeName, namespace);
  }

  compareDocumentPosition(): Number {
    // The selector engine tries to validate with this, but we don't care.
    // 8 = DOCUMENT_POSITION_CONTAINS, so we say all nodes are in this document.
    return 8;
  }

  append(parent: any, child: any): void {
    this.r.appendChild(parent, child);
  }
}
