interface UnusedFilename {
	/**
	 * Get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.
	 *
	 * @param filepath - The path to check for filename collision.
	 * @returns Either the original `filename` or the `filename` appended with a number.
	 */
	(filepath: string): Promise<string>;

	/**
	 * Synchronpusly get an unused filename by appending a number if it exists: `file.txt` → `file (1).txt`.
	 *
	 * @param filepath - The path to check for filename collision.
	 * @returns Either the original `filename` or the `filename` appended with a number.
	 */
	sync(filepath: string): string;
}

declare const unusedFilename: UnusedFilename;

export default unusedFilename;
