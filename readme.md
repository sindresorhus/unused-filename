# unused-filename [![Build Status](https://travis-ci.org/sindresorhus/unused-filename.svg?branch=master)](https://travis-ci.org/sindresorhus/unused-filename)

> Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`

Useful for safely writing, copying, moving files without overwriting existing files.


## Install

```
$ npm install unused-filename
```


## Usage

```
.
├── rainbow (1).txt
├── rainbow.txt
└── unicorn.txt
```

```js
const unusedFilename = require('unused-filename');

(async () => {
	console.log(await unusedFilename('rainbow.txt'));
	//=> 'rainbow (2).txt'
})();
```


## API

### unusedFilename(filePath, options?)

Returns a `Promise<string>` containing either the original `filename` or the `filename` increased by `options.incrementer`.

### unusedFilename.sync(filePath, options?)

Returns a `string` containing either the original `filename` or the `filename` increased by `options.incrementer`.

#### filePath

Type: `string`

The path to check for filename collision.

#### options

Type: `object`

##### options.incrementer

Type: `function`

filename increase function.


## Related

- [filenamify](https://github.com/sindresorhus/filenamify) - Convert a string to a valid safe filename


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
