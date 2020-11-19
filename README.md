# Block Finder

Block Finder combines glob-based file scans with regex-based token matches to find, parse, and extract multiline heredoc patterns from text files … and it does it really fast.

### Usage

```bash
[~] npm i block-finder
```

```javascript
// modules
const bf = require('block-finder');

// configure options
const options = {
  cwd: '.',
  glob: '**/*.(js|md)',
  ignore: '**/node_modules',
  start: '/** START **/',
  stop: '/** STOP **/',
};

// promise
bf(options).then(console.log).catch(console.error);

// callback
bf(options, (err, results) => (!!err) ? console.error(err) : console.log(results));

// sync
try {
	console.log(bf({ ...options, mode: 'sync' }));
} catch (err) {
	console.error(err);
}
```

### Options

key			| type						| default						| description
---			| ---							| ---								| ---
cwd			| String					| `process.cwd()`		| Current working directory to start searches from
glob		| String\|Array		| none							| Glob patterns to be used for file searches
ignore	| String\|Array		| `**/node_modules`	| Glob patterns to ignore in file searches
mode		| String					| `async`						| Whether to run in __sync__ or __async__ mode _(default=async)_
start		| String\|RegExp	| none							| Starting text block search string pattern
stop		| String\|RegExp	| none							| Stopping text block search string pattern

### License

[MIT License](https://github.com/tobiusventures/block-finder/LICENSE)

