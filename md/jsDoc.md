```js
/**
 * @type {(String|Array.<String>)}
 * @type {Number}
 *
 * @param a - desc for a
 * @param {} a - desc for a
 * @param {String} a - desc for a
 * @param {String|Number} a - desc
 *
 * @param {Array<String>} b - desc
 *
 * @param {Object} opt - desc
 * @param {Object} opt.attr1 - desc
 * @param {Object} opt.attr2 - desc
 *
 * @param {Object[]} d - desc
 * @param {Object} d.index1 - desc
 * @param {Object} d.index2 - desc
 *
 * @param {String} [e] - 可选参数
 * @param {String} [e=1] - 可选参数+默认值为1
 *
 * @returns {Number} I am 2
 */
const func = (a, b, opt = {}, d, e) => {
  return 2;
};
```
