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

	@returns The new incremented filename, including extension.

	@example
	```
	import unusedFilename = require('unused-filename');
	(async () => {
		const filename = await unusedFilename('rainbow.txt', {
			incrementer(filename, extension) => {
				const match = filename.match(/^(?<index>\d+)_(?<originalFilename>.*)$/);
				let {originalFilename, index} = match ? match.groups : {originalFilename: filename, index: 0};
				return `${++index}_${originalFilename.trim()}${extension}`;
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
}

declare const unusedFilename: {
	/**
	Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@param options - Options object.

	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).
	*/
	(filePath: string, options?: unusedFilename.Options): Promise<string>;

	/**
	Synchronously get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@param options - Options object.

	@returns Either the original `filename` or the `filename` appended with a number (or modified by `option.incrementer` if specified).
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

	// TODO: Remove this for the next major release
	default: typeof unusedFilename;
};

export = unusedFilename;
