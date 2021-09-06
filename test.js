import path from 'path';
import test from 'ava';
import unusedFilename from './index.js';

const fixturePath = file => path.join('fixtures', file);
const underscore = {incrementer: unusedFilename.separatorIncrementer('_')};
const dash = {incrementer: unusedFilename.separatorIncrementer('-')};

test('async', async t => {
	t.is(await unusedFilename(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(await unusedFilename(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('async - maxTries option', async t => {
	const error = await t.throwsAsync(async () => {
		await unusedFilename(fixturePath('rainbow (1).txt'), {maxTries: 1});
	}, {instanceOf: unusedFilename.MaxTryError});

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
	t.is(unusedFilename.sync(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(unusedFilename.sync(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(unusedFilename.sync(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('sync - maxTries option', t => {
	const error = t.throws(() => {
		unusedFilename.sync(fixturePath('rainbow (1).txt'), {maxTries: 1});
	}, {instanceOf: unusedFilename.MaxTryError});

	t.is(error.originalPath, fixturePath('rainbow.txt'));
	t.is(error.lastTriedPath, fixturePath('rainbow (2).txt'));
});

test('sync - incrementer option', t => {
	t.is(unusedFilename.sync(fixturePath('noop.txt'), underscore), fixturePath('noop.txt'));
	t.is(unusedFilename.sync(fixturePath('unicorn.txt'), underscore), fixturePath('unicorn_1.txt'));
	t.is(unusedFilename.sync(fixturePath('rainbow.txt'), underscore), fixturePath('rainbow_3.txt'));
	t.is(unusedFilename.sync(fixturePath('rainbow.txt'), dash), fixturePath('rainbow-2.txt'));
});
