import test from 'ava';
// For test on windows
import slash from 'slash';
import unusedFilename from '.';

test('async', async t => {
	t.is(slash(await unusedFilename('fixtures/noop.txt')), 'fixtures/noop.txt');
	t.is(slash(await unusedFilename('fixtures/unicorn.txt')), 'fixtures/unicorn (1).txt');
	t.is(slash(await unusedFilename('fixtures/rainbow.txt')), 'fixtures/rainbow (3).txt');
});

test('sync', t => {
	t.is(slash(unusedFilename.sync('fixtures/noop.txt')), 'fixtures/noop.txt');
	t.is(slash(unusedFilename.sync('fixtures/unicorn.txt')), 'fixtures/unicorn (1).txt');
	t.is(slash(unusedFilename.sync('fixtures/rainbow.txt')), 'fixtures/rainbow (3).txt');
});

test('options.incrementer', async t => {
	const testFile = 'fixtures/rainbow.txt';

	const incrementerTest = async ({incrementer, error, message, result}) => {
		if (error) {
			t.throws(
				() => unusedFilename.sync(testFile, {incrementer}),
				error,
				message
			);

			await t.throwsAsync(
				unusedFilename(testFile, {incrementer}),
				error,
				message
			);
		} else {
			t.is(
				slash(unusedFilename.sync(testFile, {incrementer})),
				result,
				message
			);

			t.is(
				slash(await unusedFilename(testFile, {incrementer})),
				result,
				message
			);
		}
	};

	await Promise.all(
		[
			{
				incrementer: '',
				error: TypeError,
				message: '`incrementer` should be a function'
			},
			{
				incrementer() {},
				error: TypeError,
				message: '`incrementer` should return a string'
			},
			{
				incrementer() {
					return 'rainbow.txt';
				},
				error: Error,
				message: '`incrementer` should return unique names'
			},
			{
				incrementer(filename, extension, counter) {
					return `${filename}${'_'.repeat(counter)}${extension}`;
				},
				result: 'fixtures/rainbow___.txt'
			}
		].map(incrementerTest)
	);
});
