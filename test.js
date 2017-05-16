import test from 'ava';
import m from '.';

test('async', async t => {
	t.is(await m('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(await m('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(await m('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
});

test('sync', t => {
	t.is(m.sync('fixtures/noop.txt'), 'fixtures/noop.txt');
	t.is(m.sync('fixtures/unicorn.txt'), 'fixtures/unicorn (1).txt');
	t.is(m.sync('fixtures/rainbow.txt'), 'fixtures/rainbow (3).txt');
});
