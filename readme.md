# unused-filename

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

Returns a `Promise<string>` containing either the original `filename` or the `filename` increment by `options.incrementer`.

### unusedFilename.sync(filePath, options?)

Returns a `string` containing either the original `filename` or the `filename` increment by `options.incrementer`.

#### filePath

Type: `string`

The path to check for filename collision.

#### options

Type: `object`

Parameters:

- **incrementer**: `Incrementer` - a function that accepts a file path and increments its index.
- **maxTries**: `number` - a max number of attempts to take. Default: `Infinity`.

##### incrementer

Type: `(filePath: string) => string`
Default: Parentheses incrementer (`file.txt` → `file (1).txt`).

A simple function that accepts a file path, and increments its index. It's incrementer's responsibility to extract an already existing index from passed file.

Example incrementer that appends new index as an underscore suffix:

```js
const modifyFilename = require('modify-filename');
const underscoreIncrementer = filePath => modifyFilename(filePath, (filename, extension) => {
	let [, originalFilename, index] = filename.match(/^(.*)_(\d+)$/) || [null, filename, 0];
	return `${originalFilename.trim()}_${++index}${extension}`;
});

console.log(await unusedFilename('rainbow.txt', {incrementer: underscoreIncrementer}));
//=> 'rainbow_1.txt'
```

##### maxTries

Type: `number`
Default: `Infinity`

Max number of attempts to find an unused filename before giving up and returning the last tried name.

### unusedFilename.separatorIncrementer

Creates an incrementer that appends a number after a separator:

```js
console.log(await unusedFilename('rainbow.txt', {incrementer: unusedFilename.separatorIncrementer('_')}));
//=> 'rainbow_1.txt'
```

## Related

- [filenamify](https://github.com/sindresorhus/filenamify) - Convert a string to a valid safe filename


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
