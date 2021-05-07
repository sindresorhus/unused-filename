import Path from 'path';
import test from 'ava';
import unusedFilename from '.';

const fixturePath = file => Path.join('fixtures', file);
const underscore = {incrementer: unusedFilename.separatorIncrementer('_')};

test('async', async t => {
	t.is(await unusedFilename(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(await unusedFilename(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('async respects maxTries', async t => {
	t.is(await unusedFilename(fixturePath('rainbow.txt'), {maxTries: 1}), fixturePath('rainbow (1).txt'));
});

test('async uses custom incrementer', async t => {
	t.is(await unusedFilename(fixturePath('noop.txt'), underscore), fixturePath('noop.txt'));
	t.is(await unusedFilename(fixturePath('unicorn.txt'), underscore), fixturePath('unicorn_1.txt'));
	t.is(await unusedFilename(fixturePath('rainbow.txt'), underscore), fixturePath('rainbow_3.txt'));
});

test('sync', t => {
	t.is(unusedFilename.sync(fixturePath('noop.txt')), fixturePath('noop.txt'));
	t.is(unusedFilename.sync(fixturePath('unicorn.txt')), fixturePath('unicorn (1).txt'));
	t.is(unusedFilename.sync(fixturePath('rainbow.txt')), fixturePath('rainbow (3).txt'));
});

test('sync respects maxTries', t => {
	t.is(unusedFilename.sync(fixturePath('rainbow.txt'), {maxTries: 1}), fixturePath('rainbow (1).txt'));
});

test('sync uses custom incrementer', t => {
	t.is(unusedFilename.sync(fixturePath('noop.txt'), underscore), fixturePath('noop.txt'));
	t.is(unusedFilename.sync(fixturePath('unicorn.txt'), underscore), fixturePath('unicorn_1.txt'));
	t.is(unusedFilename.sync(fixturePath('rainbow.txt'), underscore), fixturePath('rainbow_3.txt'));
});
