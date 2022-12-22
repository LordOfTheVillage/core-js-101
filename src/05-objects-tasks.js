/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable prefer-template */
/* eslint-disable no-underscore-dangle */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  _build: '',
  _element: '',
  _id: '',
  _class: '',
  _attribute: '',
  _pseudoClass: '',
  _pseudoElement: '',
  _order: -1,

  element(value) {
    const object = Object.create(this);
    if (object._element !== '') object.throwError(0);
    if (object._order > 0) object.throwError(1);
    object._order = 0;
    object._element = value;
    return object;
  },

  id(value) {
    const object = Object.create(this);
    if (object._id !== '') object.throwError(0);
    if (object._order > 1) object.throwError(1);
    object._order = 1;
    object._id = value;
    return object;
  },

  class(value) {
    const object = Object.create(this);
    if (object._order > 2) object.throwError(1);
    object._order = 2;
    if (object._class !== '') object._class += `.${value}`;
    else object._class += value;
    return object;
  },

  attr(value) {
    const object = Object.create(this);
    if (object._order > 3) object.throwError(1);
    object._order = 3;
    object._attribute = value;
    return object;
  },

  pseudoClass(value) {
    const object = Object.create(this);
    if (object._order > 4) object.throwError(1);
    object._order = 4;
    if (object._pseudoClass !== '') object._pseudoClass += `:${value}`;
    else object._pseudoClass += value;
    return object;
  },

  pseudoElement(value) {
    const object = Object.create(this);
    if (object._pseudoElement !== '') object.throwError(0);
    if (object._order > 5) object.throwError(1);
    object._order = 5;
    if (object._pseudoElement !== '') object._pseudoElement += `::${value}`;
    else object._pseudoElement += value;
    return object;
  },

  combine(selector1, combinator, selector2) {
    const object = Object.create(this);
    const s1 = selector1.stringify();
    const s2 = selector2.stringify();
    object._build = s1 + ' ' + combinator + ' ' + s2;
    return object;
  },

  _clear() {
    const object = Object.create(this);
    object._build = '';
    object._element = '';
    object._id = '';
    object._class = '';
    object._attribute = '';
    object._pseudoClass = '';
    object._pseudoElement = '';
    object._order = -1;
    return object;
  },

  // checkOrder(index, array) {
  //   return array.every((e, i) => i <= index || e === 0);
  // },

  throwError(code) {
    if (code === 0) {
      throw new Error(
        'Element, id and pseudo-element should not occur more then one time inside the selector'
      );
    }
    if (code === 1) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }
  },

  stringify() {
    let result = '';

    if (this._build !== '') {
      result += this._build;
      this._clear();
      return result;
    }

    if (this._element !== '') result += this._element;
    if (this._id !== '') result += `#${this._id}`;
    if (this._class !== '') result += `.${this._class}`;
    if (this._attribute !== '') result += `[${this._attribute}]`;
    if (this._pseudoClass !== '') result += `:${this._pseudoClass}`;
    if (this._pseudoElement !== '') result += `::${this._pseudoElement}`;
    this._clear();
    return result;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
