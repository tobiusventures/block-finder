// modules
const bf = require('../main');

// configure options
const options = {
  cwd: '.',
  glob: '**/*.(js|md)',
  ignore: '**/node_modules',
  start: '/** START **/',
  stop: '/** STOP **/',
};

// promise
bf(options).then(console.log);

// callback
bf(options, console.log);

// sync
console.log(bf({ ...options, mode: 'sync' }));
