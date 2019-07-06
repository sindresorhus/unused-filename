'use strict';
const pathExists = require('path-exists');
const modifyFilename = require('modify-filename');
const slash = require('slash');

const defaultIncrementer = (filename, extension, counter) =>
	`${filename} (${counter})${extension}`;

const findUnusedFilePath = (filePath, options, sync) => {
	options = {
		incrementer: defaultIncrementer,
		...options
	};

	let counter = 0;
	const triedFileNames = new Set();

	const incrementer = () =>
		modifyFilename(filePath, (filename, extension) =>
			options.incrementer(filename, extension, ++counter)
		);

	const checkIsTried = newFilePath => {
		if (triedFileNames.has(newFilePath)) {
			throw new Error('`incrementer` should return unique names');
		}

		triedFileNames.add(newFilePath);
	};

	let find;

	if (sync) {
		find = newFilePath => {
			checkIsTried(newFilePath);

			return pathExists.sync(newFilePath) ?
				find(incrementer()) :
				slash(newFilePath);
		};
	} else {
		find = async newFilePath => {
			checkIsTried(newFilePath);

			return (await pathExists(newFilePath)) ?
				find(incrementer()) :
				slash(newFilePath);
		};
	}

	return find(filePath);
};

const unusedFilename = (filePath, options) => {
	return findUnusedFilePath(filePath, options, false);
};

const unusedFilenameSync = (filePath, options) => {
	return findUnusedFilePath(filePath, options, true);
};

module.exports = unusedFilename;
// TODO: Remove this for the next major release
module.exports.default = unusedFilename;
module.exports.sync = unusedFilenameSync;
