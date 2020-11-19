// module
const BlockFinder = require('./block-finder');

/**
 * Instantiate and execute BlockFinder as a Promise
 *
 * @param {BlockFinder} bf
 * @return {Promise.<Array>} results
 */
function promise(bf) {
  return bf.find();
}

/**
 * Instantiate and execute BlockFinder as a callback
 *
 * @param {BlockFinder} bf
 * @param {Function} cb(err, results)
 * @return {Void}
 */
function callback(bf, cb) {
  bf.find().then((results) => cb(null, results)).catch(cb);
}

/**
 * Instantiate and execute BlockFinder synchronously
 *
 * @param {BlockFinder} bf
 * @return {Array} results
 */
function sync(bf) {
  return bf.findSync();
}

/**
 * Proxy preferred execution style
 *
 * @param {Object} options
 * @param {Function} [cb]
 * @return {Mixed}
 */
function proxy(options, cb = null) {
  const bf = new BlockFinder(options);
  if (options.mode === 'sync') {
    return sync(bf);
  }
  if (cb === null) {
    return promise(bf);
  }
  callback(bf, cb);
}

module.exports = proxy;
