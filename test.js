import path from 'node:path';
import test from 'ava';
import {unusedFilename, unusedFilenameSync, separatorIncrementer, MaxTryError} from './index.js';

const fixturePath = file => path.join('fixtures', file);
const underscore = {incrementer: separatorIncrementer('_')};
const dash = {incrementer: separatorIncrementer('-')};

test('async', async t => {
	t.is(await unusedFilename(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(await unusedFilename(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('async - maxTries option', async t => {
	const error = await t.throwsAsync(async () => {
		await unusedFilename(fixturePath('rainbow (1).txt'), {maxTries: 1});
	}, {instanceOf: MaxTryError});

	t.is(error.originalPath, fixturePath('rainbow.txt'));
	t.is(error.lastTriedPath, fixturePath('rainbow (2).txt'));
});

test('async - incrementer option', async t => {
	t.is(await unusedFilename(fixturePath('noop.txt'), underscore), fixturePath('noop.txt'));
	t.is(await unusedFilename(fixturePath('unicorn.txt'), underscore), fixturePath('unicorn_1.txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt'), underscore), fixturePath('rainbow_3.txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt'), dash), fixturePath('rainbow-2.txt'));
});

test('sync', t => {
	t.is(unusedFilenameSync(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(unusedFilenameSync(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(unusedFilenameSync(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('sync - maxTries option', t => {
	const error = t.throws(() => {
		unusedFilenameSync(fixturePath('rainbow (1).txt'), {maxTries: 1});
	}, {instanceOf: MaxTryError});

	t.is(error.originalPath, fixturePath('rainbow.txt'));
	t.is(error.lastTriedPath, fixturePath('rainbow (2).txt'));
});

test('sync - incrementer option', t => {
	t.is(unusedFilenameSync(fixturePath('noop.txt'), underscore), fixturePath('noop.txt'));
	t.is(unusedFilenameSync(fixturePath('unicorn.txt'), underscore), fixturePath('unicorn_1.txt'));
	t.is(unusedFilenameSync(fixturePath('rainbow.txt'), underscore), fixturePath('rainbow_3.txt'));
	t.is(unusedFilenameSync(fixturePath('rainbow.txt'), dash), fixturePath('rainbow-2.txt'));
});
