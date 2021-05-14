declare namespace unusedFilename {
	interface Options {
		/**
		Custom function to increment a filename.

		By default, parentheses incrementer is used (`file.txt` → `file (1).txt`).
		*/
		incrementer?: Incrementer;

		/**
		Max number of attempts to find an unused filename before giving up and returning the last tried name.

		@default Infinity
		*/
		maxTries?: number;
	}

	/**
	Function that extracts and increments its incrementation format sequence on a filename.

	@param filename - The filename of the file path.
	@param extension - The extension of the file path.

	@returns A tuple of original filename, and new incremented filename, including extension.

	@example
	```
	const unusedFilename = require('unused-filename');
	(async () => {
		const filename = await unusedFilename('rainbow.txt', {
			incrementer(filename, extension) => {
				const match = filename.match(/^(?<index>\d+)_(?<originalFilename>.*)$/);
				let {originalFilename, index} = match ? match.groups : {originalFilename: filename, index: 0};
				let originalFilename = originalFilename.trim();
				return [`${originalFilename}${extension}`, `${++index}_${originalFilename}${extension}`;
			}
		})
		console.log(filename);
		//=> '1_rainbow.txt'
	})();
	```
	*/
	interface Incrementer {
		(filename: string, extension: string): string;
	}

	/**
	An error thrown when maxTries limit has been reached without finding an unused path.

	@param originalPath - Path without the incrementation sequence.
	@param lastTriedPath - Last tested incremented path.

	@example
	```
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
	*/
	interface MaxTryError extends Error {
		originalPath: string;
		lastTriedPath: string;
	}
}

declare const unusedFilename: {
	/**
	Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@param options - Options object.

	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).

	If an already incremented `filePath` is passed, `unusedFilename` will simply increment and replace the already existing index.

	@example
	```js
	const unusedFilename = require('unused-filename');

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
	@param options - Options object.

	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).

	If an already incremented `filePath` is passed, `unusedFilename` will simply increment and replace the already existing index.

	@example
	```js
	const unusedFilename = require('unused-filename');

	(async () => {
		console.log(unusedFilename.sync('rainbow (1).txt'));
		//=> 'rainbow (2).txt'
	})();
	```
	*/
	sync(filePath: string, options?: unusedFilename.Options): string;

	/**
	Creates an incrementer that appends a number after a separator.

	`separatorIncrementer('_')` will increment `file.txt` → `file_1.txt`.

	Not all characters can be used as separators:
	- On Unix-like systems, / is reserved.
	- On Windows, <>:"/|?* along with trailing periods are reserved.
	*/
	separatorIncrementer: (separator: string) => unusedFilename.Incrementer;

	/**
	An error thrown when maxTries limit has been reached without finding an unused path.

	@param originalPath - Path without the incrementation sequence.
	@param lastTriedPath - Last tested incremented path.

	@example
	```
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
	*/
	MaxTryError: unusedFilename.MaxTryError & {
		new (originalPath: string, lastTriedPath: string): unusedFilename.MaxTryError;
	};

	// TODO: Remove this for the next major release
	default: typeof unusedFilename;
};

export = unusedFilename;
