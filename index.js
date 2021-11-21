import path from 'node:path';
import {pathExists, pathExistsSync} from 'path-exists';
import escapeStringRegexp from 'escape-string-regexp';

export class MaxTryError extends Error {
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

const incrementPath = (filePath, incrementer) => {
	const ext = path.extname(filePath);
	const dirname = path.dirname(filePath);
	const [originalFilename, incrementedFilename] = incrementer(path.basename(filePath, ext), ext);
	return [path.join(dirname, originalFilename), path.join(dirname, incrementedFilename)];
};

export const separatorIncrementer = separator => {
	const escapedSeparator = escapeStringRegexp(separator);

	return (inputFilename, extension) => {
		const match = new RegExp(`^(?<filename>.*)${escapedSeparator}(?<index>\\d+)$`).exec(inputFilename);
		let {filename, index} = match ? match.groups : {filename: inputFilename, index: 0};
		return [`${filename}${extension}`, `${filename.trim()}${separator}${++index}${extension}`];
	};
};

export async function unusedFilename(filePath, {incrementer = parenthesesIncrementer, maxTries = Number.POSITIVE_INFINITY} = {}) {
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
}

export function unusedFilenameSync(filePath, {incrementer = parenthesesIncrementer, maxTries = Number.POSITIVE_INFINITY} = {}) {
	let tries = 0;
	let [originalPath] = incrementPath(filePath, incrementer);
	let unusedPath = filePath;

	/* eslint-disable no-constant-condition */
	while (true) {
		if (!pathExistsSync(unusedPath)) {
			return unusedPath;
		}

		if (++tries > maxTries) {
			throw new MaxTryError(originalPath, unusedPath);
		}

		[originalPath, unusedPath] = incrementPath(unusedPath, incrementer);
	}
	/* eslint-enable no-constant-condition */
}
