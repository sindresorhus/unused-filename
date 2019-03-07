import test from 'ava';
import unusedFilename from '.';

test('async', async t => {
	t.is(await unusedFilename('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(await unusedFilename('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(await unusedFilename('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
});

test('sync', t => {
	t.is(unusedFilename.sync('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(unusedFilename.sync('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(unusedFilename.sync('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
});
