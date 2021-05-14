'use strict';
const path = require('path');
const pathExists = require('path-exists');
const escapeStringRegexp = require('escape-string-regexp');

class MaxTryError extends Error {
	constructor(originalPath, lastTriedPath) {
		super('Max tries reached.');
		this.originalPath = originalPath;
		this.lastTriedPath = lastTriedPath;
	}
}

const parenthesesIncrementer = (inputFilename, extension) => {
	const match = inputFilename.match(/^(?<filename>.*)\((?<index>\d+)\)$/);
	let {filename, index} = match ? match.groups : {filename: inputFilename, index: 0};
	filename = filename.trim();
	return [`${filename}${extension}`, `${filename} (${++index})${extension}`];
};

const separatorIncrementer = separator => {
	const escapedSeparator = escapeStringRegexp(separator);

	return (inputFilename, extension) => {
		const match = new RegExp(`^(?<filename>.*)${escapedSeparator}(?<index>\\d+)$`).exec(inputFilename);
		let {filename, index} = match ? match.groups : {filename: inputFilename, index: 0};
		return [`${filename}${extension}`, `${filename.trim()}_${++index}${extension}`];
	};
};

const incrementPath = (filePath, incrementer) => {
	const ext = path.extname(filePath);
	const dirname = path.dirname(filePath);
	const [originalFilename, incrementedFilename] = incrementer(path.basename(filePath, ext), ext);
	return [path.join(dirname, originalFilename), path.join(dirname, incrementedFilename)];
};

const unusedFilename = async (filePath, {incrementer = parenthesesIncrementer, maxTries = Infinity} = {}) => {
	let tries = 0;
	let [originalPath] = incrementPath(filePath, incrementer);
	let unusedPath = filePath;

	/* eslint-disable no-await-in-loop, no-constant-condition */
	while (true) {
		if (!(await pathExists(unusedPath))) {
			return unusedPath;
		}

		if (++tries > maxTries) {
			throw new MaxTryError(originalPath, unusedPath);
		}

		[originalPath, unusedPath] = incrementPath(unusedPath, incrementer);
	}
	/* eslint-enable no-await-in-loop, no-constant-condition */
};

module.exports = unusedFilename;
// TODO: Remove this for the next major release
module.exports.default = unusedFilename;

module.exports.sync = (filePath, {incrementer = parenthesesIncrementer, maxTries = Infinity} = {}) => {
	let tries = 0;
	let [originalPath] = incrementPath(filePath, incrementer);
	let unusedPath = filePath;

	/* eslint-disable no-constant-condition */
	while (true) {
		if (!pathExists.sync(unusedPath)) {
			return unusedPath;
		}

		if (++tries > maxTries) {
			throw new MaxTryError(originalPath, unusedPath);
		}

		[originalPath, unusedPath] = incrementPath(unusedPath, incrementer);
	}
	/* eslint-enable no-constant-condition */
};

module.exports.MaxTryError = MaxTryError;
module.exports.separatorIncrementer = separatorIncrementer;
