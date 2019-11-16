declare namespace unusedFilename {
	interface Options {
		/**
		Filename increment function.

		@param filename - The filename of the file path.
		@param extension - The extension of the file path.
		@param counter - Tried count.
		@returns The new filename.

		@example
		```
		import unusedFilename = require('unused-filename');

		(async () => {
			const filename = await unusedFilename('rainbow.txt', {
				incrementer(filename, extension, counter) {
					return `${filename}${'_'.repeat(counter)}${extension}`
				}
			})

			console.log(filename);
			//=> 'rainbow__.txt'
		})();
		```
		*/
		readonly incrementer?: (filename: string, extension: string, counter: number) => string;
	}
}

declare const unusedFilename: {
	/**
	Get an unused `filename` increment by `option.incrementer` if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@returns Either the original `filename` or the `filename` increment by `option.incrementer`.
	*/
	(filePath: string, options?: unusedFilename.Options): Promise<string>;

	/**
	Synchronously get an unused `filename` increment by `option.incrementer` if it exists: `file.txt` → `file (1).txt`.

	@param filePath - The path to check for filename collision.
	@returns Either the original `filename` or the `filename` increment by `option.incrementer`.
	*/
	sync(filePath: string, options?: unusedFilename.Options): string;

	// TODO: Remove this for the next major release
	default: typeof unusedFilename;
};

export = unusedFilename;
