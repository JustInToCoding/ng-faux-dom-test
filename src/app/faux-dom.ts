import camelCase, { styleCamelCase } from './camel-case';
import isString from './is-string';
import parse from './style-attr';
import * as querySelectorAll from 'query-selector';
import { Renderer2 } from '@angular/core';

function Element (renderer: Renderer2, nodeName: string, parentNode): void {
  this.renderer = renderer;
  this.realElement = renderer.createElement(nodeName);
  this.nodeName = nodeName;
  this.parentNode = parentNode;
  this.childNodes = [];
  this.eventListeners = {};
  this.text = '';
  const self = this;
  const props = this.props = {
    ref(component) {
      self.component = component;
    },
    style: {
      setProperty(name, value) {
        props.style[styleCamelCase(name)] = value;
      },
      getProperty(name) {
        return props.style[styleCamelCase(name)] || '';
      },
      getPropertyValue(name) {
        return props.style.getProperty(name);
      },
      removeProperty(name) {
        delete props.style[styleCamelCase(name)];
      }
    }
  };

  this.style = props.style;
}

Element.prototype.nodeType = 1;

Element.prototype.eventNameMappings = {
  'blur': 'onBlur',
  'change': 'onChange',
  'click': 'onClick',
  'contextmenu': 'onContextMenu',
  'copy': 'onCopy',
  'cut': 'onCut',
  'doubleclick': 'onDoubleClick',
  'drag': 'onDrag',
  'dragend': 'onDragEnd',
  'dragenter': 'onDragEnter',
  'dragexit': 'onDragExit',
  'dragleave': 'onDragLeave',
  'dragover': 'onDragOver',
  'dragstart': 'onDragStart',
  'drop': 'onDrop',
  'error': 'onError',
  'focus': 'onFocus',
  'input': 'onInput',
  'keydown': 'onKeyDown',
  'keypress': 'onKeyPress',
  'keyup': 'onKeyUp',
  'load': 'onLoad',
  'mousedown': 'onMouseDown',
  'mouseenter': 'onMouseEnter',
  'mouseleave': 'onMouseLeave',
  'mousemove': 'onMouseMove',
  'mouseout': 'onMouseOut',
  'mouseover': 'onMouseOver',
  'mouseup': 'onMouseUp',
  'paste': 'onPaste',
  'scroll': 'onScroll',
  'submit': 'onSubmit',
  'touchcancel': 'onTouchCancel',
  'touchend': 'onTouchEnd',
  'touchmove': 'onTouchMove',
  'touchstart': 'onTouchStart',
  'wheel': 'onWheel'
};

Element.prototype.skipNameTransformationExpressions = [
  /^data-/,
  /^aria-/
];

Element.prototype.attributeNameMappings = {
  'class': 'className'
};

Element.prototype.attributeToPropName = function (name) {
  const skipTransformMatches = this.skipNameTransformationExpressions.map(function (expr) {
    return expr.test(name);
  });

  if (skipTransformMatches.some(Boolean)) {
    return name;
  } else {
    return this.attributeNameMappings[name] || camelCase(name);
  }
};

Element.prototype.setAttribute = function (name, value) {
  if (name === 'style' && isString(value)) {
    const styles = parse(value);

    Object.keys(styles).forEach(key => {
      this.style.setProperty(key, styles[key]);
    });
  } else {
    this.props[this.attributeToPropName(name)] = value;
  }
};

Element.prototype.getAttribute = function (name) {
  return this.props[this.attributeToPropName(name)];
};

Element.prototype.getAttributeNode = function (name) {
  const value = this.getAttribute(name);

  if (typeof value !== 'undefined') {
    return {
      value: value,
      specified: true
    };
  }
};

Element.prototype.removeAttribute = function (name) {
  delete this.props[this.attributeToPropName(name)];
};

Element.prototype.eventToPropName = function (name) {
  return this.eventNameMappings[name] || name;
};

Element.prototype.addEventListener = function (name, fn) {
  const prop = this.eventToPropName(name);
  this.eventListeners[prop] = this.eventListeners[prop] || [];
  this.eventListeners[prop].push(fn);
};

Element.prototype.removeEventListener = function (name, fn) {
  const listeners = this.eventListeners[this.eventToPropName(name)];

  if (listeners) {
    const match = listeners.indexOf(fn);

    if (match !== -1) {
      listeners.splice(match, 1);
    }
  }
};

Element.prototype.appendChild = function (el) {
  if (el instanceof Element) {
    el.parentNode = this;
  }

  this.childNodes.push(el);
  return el;
};

Element.prototype.insertBefore = function (el, before) {
  const index = this.childNodes.indexOf(before);
  el.parentNode = this;

  if (index !== -1) {
    this.childNodes.splice(index, 0, el);
  } else {
    this.childNodes.push(el);
  }

  return el;
};

Element.prototype.removeChild = function (child) {
  const target = this.childNodes.indexOf(child);
  this.childNodes.splice(target, 1);
};

Element.prototype.querySelector = function () {
  return this.querySelectorAll.apply(this, arguments)[0] || null;
};

Element.prototype.querySelectorAll = function (selector) {
  if (!selector) {
    throw new Error('Not enough arguments');
  }

  return querySelectorAll(selector, this);
};

Element.prototype.getElementsByTagName = function (nodeName) {
  const children = this.children;

  if (children.length === 0) {
    return [];
  } else {
    let matches;

    if (nodeName !== '*') {
      matches = children.filter(function (el) {
        return el.nodeName === nodeName;
      });
    } else {
      matches = children;
    }

    const childMatches = children.map(function (el) {
      return el.getElementsByTagName(nodeName);
    });

    return matches.concat.apply(matches, childMatches);
  }
};

Element.prototype.getElementById = function (id) {
  const children = this.children;

  if (children.length === 0) {
    return null;
  } else {
    const match = children.filter(function (el) {
      return el.getAttribute('id') === id;
    })[0];

    if (match) {
      return match;
    } else {
      const childMatches = children.map(function (el) {
        return el.getElementById(id);
      });

      return childMatches.filter(function (childMatch) {
        return childMatch !== null;
      })[0] || null;
    }
  }
};

Element.prototype.getBoundingClientRect = function () {
  if (!this.component) {
    return undefined;
  }

  return this.component.getBoundingClientRect();
};

Element.prototype.createElement = function(name) {
  const renderer = <Renderer2>(this.renderer);
  return renderer.createElement(name);
};

Object.defineProperties(Element.prototype, {
  nextSibling: {
    get: function () {
      const siblings = this.parentNode.children;
      const me = siblings.indexOf(this);
      return siblings[me + 1];
    }
  },
  previousSibling: {
    get: function () {
      const siblings = this.parentNode.children;
      const me = siblings.indexOf(this);
      return siblings[me - 1];
    }
  },
  innerHTML: {
    get: function () {
      return this.text;
    },
    set: function (text) {
      this.text = text;
    }
  },
  textContent: {
    get: function () {
      return this.text;
    },
    set: function (text) {
      this.text = text;
    }
  },
  children: {
    get: function () {
      // So far nodes created by this library are all of nodeType 1 (elements),
      // but this could change in the future.
      return this.childNodes.filter(function (el) {
        if (!el.nodeType) {
          // It's a React element, we always add it
          return true;
        }

        // It's a HTML node. We want to filter to have only nodes with type 1
        return el.nodeType === 1;
      });
    }
  }
});

// These NS methods are called by things like D3 if it spots a namespace.
// Like xlink:href. I don't care about namespaces, so these functions have NS aliases created.
const namespaceMethods = [
  'setAttribute',
  'getAttribute',
  'getAttributeNode',
  'removeAttribute',
  'getElementsByTagName',
  'getElementById',
  'createElement'
];

namespaceMethods.forEach(function (name) {
  const fn = Element.prototype[name];
  Element.prototype[name + 'NS'] = function () {
    return fn.apply(this, Array.prototype.slice.call(arguments, 1));
  };
});

export default Element;
