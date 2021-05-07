'use strict';
const pathExists = require('path-exists');
const modifyFilename = require('modify-filename');
const escapeStringRegexp = require('escape-string-regexp');

const parenthesesIncrementer = (inputFilename, extension) => {
	const match = inputFilename.match(/^(?<filename>.*)\((?<index>\d+)\)$/);
	let {filename, index} = match ? match.groups : {filename: inputFilename, index: 0};
	return `${filename.trim()} (${++index})${extension}`;
};

const separatorIncrementer = separator => {
	const escapedSeparator = escapeStringRegexp(separator);

	return (inputFilename, extension) => {
		const match = new RegExp(`^(?<filename>.*)${escapedSeparator}(?<index>\\d+)$`).exec(inputFilename);
		let {filename, index} = match ? match.groups : {filename: inputFilename, index: 0};
		return `${filename.trim()}_${++index}${extension}`;
	};
};

const unusedFilename = async (filePath, {incrementer = parenthesesIncrementer, maxTries = Infinity} = {}) => {
	let tries = 0;
	let unusedFilePath = filePath;

	/* eslint-disable no-await-in-loop */
	while (tries++ < maxTries) {
		if (await pathExists(unusedFilePath)) {
			unusedFilePath = modifyFilename(unusedFilePath, incrementer);
		} else {
			return unusedFilePath;
		}
	}
	/* eslint-enable no-await-in-loop */

	return unusedFilePath;
};

module.exports = unusedFilename;
// TODO: Remove this for the next major release
module.exports.default = unusedFilename;

module.exports.sync = (filePath, {incrementer = parenthesesIncrementer, maxTries = Infinity} = {}) => {
	let tries = 0;
	let unusedFilePath = filePath;

	while (tries++ < maxTries) {
		if (pathExists.sync(unusedFilePath)) {
			unusedFilePath = modifyFilename(unusedFilePath, incrementer);
		} else {
			return unusedFilePath;
		}
	}

	return unusedFilePath;
};

module.exports.separatorIncrementer = separatorIncrementer;
