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

Options object with following parameters.

##### incrementer

Type: `(filePath: string) => [string, string]`\
Default: parentheses incrementer (`file.txt` → `file (1).txt`)

A simple function that accepts a file path, and increments its index. It's incrementer's responsibility to extract an already existing index from passed file.

The incrementer has to return a tuple of `[originalFilename, incrementedFilename]`, where `originalFilename` is the filename without incrementation sequence, and `incrementedFilename` is a filename with input incrementation sequence bumped by one.

Example incrementer that inserts a new index as a prefix:

```js
const modifyFilename = require('modify-filename');
const prefixIncrementer = (filename, extension) => {
	const match = filename.match(/^(?<index>\d+)_(?<originalFilename>.*)$/);
	let {originalFilename, index} = match ? match.groups : {originalFilename: filename, index: 0};
	let originalFilename = originalFilename.trim();
	return [`${originalFilename}${extension}`, `${++index}_${originalFilename}${extension}`;
};

console.log(await unusedFilename('rainbow.txt', {incrementer: prefixIncrementer}));
//=> '1_rainbow.txt'
```

##### maxTries

Type: `number`\
Default: `Infinity`

Max number of attempts to find an unused filename.

When `maxTries` limit is reached, the function will throw [`MaxTryError`](#unusedFilename-MaxTryError).

### unusedFilename.separatorIncrementer

Creates an incrementer that appends a number after a separator:

```js
console.log(await unusedFilename('rainbow.txt', {incrementer: unusedFilename.separatorIncrementer('_')}));
//=> 'rainbow_1.txt'
```

### unusedFilename.MaxTryError

Error thrown when `maxTries` limit is reached without finding an unused filename.

It comes with 2 custom properties:

- `originalPath` - path without incrementation sequence
- `lastTriedPath` - last tested incremented path

Example:

```js
const unusedFilename = require('unused-filename');
const MaxTryError = unusedFilename.MaxTryError;

try {
	const path = await unusedFilename('rainbow (1).txt', {maxTries: 0});
} catch (error) {
	if (error instanceof MaxTryError) {
		console.log(error.originalPath); // 'rainbow.txt'
		console.log(error.lastTriedPath); // 'rainbow (1).txt'
	}
}
```


## Related

- [filenamify](https://github.com/sindresorhus/filenamify) - Convert a string to a valid safe filename


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
