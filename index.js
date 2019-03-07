'use strict';
const pathExists = require('path-exists');
const modifyFilename = require('modify-filename');

const incrementer = filepath => {
	let i = 0;
	return () => modifyFilename(filepath, (filename, ext) => `${filename} (${++i})${ext}`);
};

const unusedFilename = filepath => {
	const getFp = incrementer(filepath);
	const find = newFilepath => pathExists(newFilepath).then(x => x ? find(getFp()) : newFilepath);
	return find(filepath);
};

module.exports = unusedFilename;
module.exports.default = unusedFilename;

module.exports.sync = fp => {
	const getFp = incrementer(fp);
	const find = newFp => pathExists.sync(newFp) ? find(getFp()) : newFp;
	return find(fp);
};
