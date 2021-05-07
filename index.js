'use strict';
const pathExists = require('path-exists');
const modifyFilename = require('modify-filename');

const parenthesesIncrementer = (filename, extension) => {
	let [, originalFilename, index] = filename.match(/^(.*)\((\d+)\)$/) || [null, filename, 0];
	return `${originalFilename.trim()} (${++index})${extension}`;
};

const underscoreIncrementer = (filename, extension) => {
	let [, originalFilename, index] = filename.match(/^(.*)_(\d+)$/) || [null, filename, 0];
	return `${originalFilename.trim()}_${++index}${extension}`;
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

module.exports.parenthesesIncrementer = parenthesesIncrementer;
module.exports.underscoreIncrementer = underscoreIncrementer;
