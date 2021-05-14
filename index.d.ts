/* eslint-disable no-redeclare */

declare namespace unusedFilename {
	interface Options {
		/**
		Custom function to increment a filename.

		Default: Parentheses incrementer: `file.txt` → `file (1).txt`
		*/
		readonly incrementer?: Incrementer;

		/**
		The max number of attempts to find an unused filename.

		When the limit is reached, the function will throw `unusedFilename.MaxTryError`.

		@default Infinity
		*/
		readonly maxTries?: number;
	}

	/**
	A function that accepts a file path, and increments its index. It's the incrementer's responsibility to extract an already existing index from the given file path so that it picks up and continues incrementing an already present index instead of appending a second one.

	The incrementer has to return a tuple of `[originalFilename, incrementedFilename]`, where `originalFilename` is the filename without the index, and `incrementedFilename` is a filename with input's index bumped by one.

	@param filename - The filename of the file path.
	@param extension - The extension of the file path.

	@returns A tuple of original filename, and new incremented filename, including extension.

	@example
	```
	// Example incrementer that inserts a new index as a prefix.

	import unusedFilename = require('unused-filename');

	(async () => {
		const filename = await unusedFilename('rainbow.txt', {
			incrementer(filename, extension) => {
				const match = filename.match(/^(?<index>\d+)_(?<originalFilename>.*)$/);
				let {originalFilename, index} = match ? match.groups : {originalFilename: filename, index: 0};
				let originalFilename = originalFilename.trim();
				return [`${originalFilename}${extension}`, `${++index}_${originalFilename}${extension}`;
			}
		});

		console.log(filename);
		//=> '1_rainbow.txt'
	})();
	```
	*/
	type Incrementer = (filename: string, extension: string) => string;

	/**
	The error thrown when `maxTries` limit is reached without finding an unused filename.

	@param originalPath - Path without the incrementation sequence.
	@param lastTriedPath - The last tested incremented path.

	@example
	```
	import unusedFilename = require('unused-filename');

	const {MaxTryError} = unusedFilename;

	try {
		const path = await unusedFilename('rainbow (1).txt', {maxTries: 0});
	} catch (error) {
		if (error instanceof MaxTryError) {
			console.log(error.originalPath); // 'rainbow.txt'
			console.log(error.lastTriedPath); // 'rainbow (1).txt'
		}
	}
	```
	*/
	interface MaxTryError extends Error {
		originalPath: string;
		lastTriedPath: string;
	}
}

declare const unusedFilename: {
	/**
	Creates an incrementer that appends a number after a separator.

	`separatorIncrementer('_')` will increment `file.txt` → `file_1.txt`.

	Not all characters can be used as separators:
	- On Unix-like systems, `/` is reserved.
	- On Windows, `<>:"/|?*` along with trailing periods are reserved.

	@example
	```
	import unusedFilename = require('unused-filename');

	console.log(await unusedFilename('rainbow.txt', {incrementer: unusedFilename.separatorIncrementer('_')}));
	//=> 'rainbow_1.txt'
	```
	*/
	separatorIncrementer: (separator: string) => unusedFilename.Incrementer;

	MaxTryError: unusedFilename.MaxTryError;

	// TODO: Remove this for the next major release
	default: typeof unusedFilename;

	/**
	Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).

	If an already incremented `filePath` is passed, `unusedFilename` will simply increment and replace the already existing index:

	@example
	```
	import unusedFilename = require('unused-filename');

	(async () => {
		console.log(await unusedFilename('rainbow (1).txt'));
		//=> 'rainbow (2).txt'
	})();
	```
	*/
	(filePath: string, options?: unusedFilename.Options): Promise<string>;

	/**
	Synchronously get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).

	If an already incremented `filePath` is passed, `unusedFilename` will simply increment and replace the already existing index:

	@example
	```
	import unusedFilename = require('unused-filename');

	console.log(unusedFilename.sync('rainbow (1).txt'));
	//=> 'rainbow (2).txt'
	```
	*/
	sync(filePath: string, options?: unusedFilename.Options): string;
};

export = unusedFilename;
