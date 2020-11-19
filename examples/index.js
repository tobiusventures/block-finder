// modules
const bf = require('../main');

// configure options
const options = {
  cwd: '.',
  glob: '**/example*.(js|md)',
  ignore: '**/node_modules',
  start: /\/\*+ ([A-Z]+)? *START \*+\//,
  stop: /\/\*+ ([A-Z]+)? *STOP \*+\//,
};

// promise
bf(options).then(console.log).catch(console.error);

// callback
// bf(options, (err, results) => (!!err) ? console.error(err) : console.log(results));

// sync
// try {
// 	console.log(bf({ ...options, mode: 'sync' }));
// } catch (err) {
// 	console.error(err);
// }
