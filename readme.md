# unused-filename

> Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`

Useful for safely writing, copying, moving files without overwriting existing files.

## Install

```sh
npm install unused-filename
```

## Usage

```
.
├── rainbow (1).txt
├── rainbow.txt
└── unicorn.txt
```

```js
import {unusedFilename} from 'unused-filename';

console.log(await unusedFilename('rainbow.txt'));
//=> 'rainbow (2).txt'
```

## API

### unusedFilename(filePath, options?)

Returns a `Promise<string>` containing either the original `filename` or the `filename` increment by `options.incrementer`.

If an already incremented `filePath` is passed, `unusedFilename` will simply increment and replace the already existing index:

```js
import {unusedFilename} from 'unused-filename';

console.log(await unusedFilename('rainbow (1).txt'));
//=> 'rainbow (2).txt'
```

### unusedFilenameSync(filePath, options?)

Synchronous version of `unusedFilename`.

#### filePath

Type: `string`

The path to check for filename collision.

#### options

Type: `object`

##### incrementer

Type: `(filePath: string) => [string, string]`\
Default: Parentheses incrementer: `file.txt` → `file (1).txt`

A function that accepts a file path, and increments its index.

It's the incrementer's responsibility to extract an already existing index from the given file path so that it picks up and continues incrementing an already present index instead of appending a second one.

The incrementer has to return a tuple of `[originalFilename, incrementedFilename]`, where `originalFilename` is the filename without the index, and `incrementedFilename` is a filename with input's index bumped by one.

```js
import {unusedFilename} from 'unused-filename';

// Incrementer that inserts a new index as a prefix.
const prefixIncrementer = (filename, extension) => {
	const match = filename.match(/^(?<index>\d+)_(?<originalFilename>.*)$/);
	let {originalFilename, index} = match ? match.groups : {originalFilename: filename, index: 0};
	originalFilename = originalFilename.trim();
	return [`${originalFilename}${extension}`, `${++index}_${originalFilename}${extension}`];
};

console.log(await unusedFilename('rainbow.txt', {incrementer: prefixIncrementer}));
//=> '1_rainbow.txt'
```

##### maxTries

Type: `number`\
Default: `Infinity`

The maximum number of attempts to find an unused filename.

When the limit is reached, the function will throw `MaxTryError`.

### separatorIncrementer

Creates an incrementer that appends a number after a separator.

`separatorIncrementer('_')` will increment `file.txt` → `file_1.txt`.

Not all characters can be used as separators:
- On Unix-like systems, `/` is reserved.
- On Windows, `<>:"/|?*` along with trailing periods are reserved.

```js
import {unusedFilename, separatorIncrementer} from 'unused-filename';

console.log(await unusedFilename('rainbow.txt', {incrementer: separatorIncrementer('_')}));
//=> 'rainbow_1.txt'
```

### MaxTryError

The error thrown when `maxTries` limit is reached without finding an unused filename.

It comes with 2 custom properties:

- `originalPath` - Path without incrementation sequence.
- `lastTriedPath` - The last tested incremented path.

Example:

```js
import {unusedFilename, MaxTryError} from 'unused-filename';

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
