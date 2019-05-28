'use strict';
const pathExists = require('path-exists');
const modifyFilename = require('modify-filename');

const defaultIncrementer = (filename, extension, counter) => `${filename} (${counter})${extension}`;

const getIncrementer = (filePath, incrementer) => {
	let counter = 0;
	return () => modifyFilename(filePath, (filename, extension) => {
		counter++;
		return incrementer(filename, extension, counter);
	});
};

const unusedFilename = (filePath, incrementer = defaultIncrementer) => {
	const getFilePath = getIncrementer(filePath, incrementer);
	const find = async newFilePath => await pathExists(newFilePath) ? find(getFilePath()) : newFilePath;
	return find(filePath);
};

module.exports = unusedFilename;
// TODO: Remove this for the next major release
module.exports.default = unusedFilename;

module.exports.sync = (filePath, incrementer = defaultIncrementer) => {
	const getFilePath = getIncrementer(filePath, incrementer);
	const find = newFilePath => pathExists.sync(newFilePath) ? find(getFilePath()) : newFilePath;
	return find(filePath);
};
