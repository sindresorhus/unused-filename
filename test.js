import test from 'ava';
import unusedFilename from '.';

const customIncrementer = (filename, extension, counter) => `${filename}${' - copy'.repeat(counter)}${extension}`;

test('async', async t => {
	t.is(await unusedFilename('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(await unusedFilename('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(await unusedFilename('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
	t.is(await unusedFilename('fixtures/rainbow.txt', customIncrementer), 'fixtures/rainbow - copy - copy - copy.txt');
});

test('sync', t => {
	t.is(unusedFilename.sync('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(unusedFilename.sync('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(unusedFilename.sync('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
	t.is(unusedFilename.sync('fixtures/rainbow.txt', customIncrementer), 'fixtures/rainbow - copy - copy - copy.txt');
});
