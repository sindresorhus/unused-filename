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
				async () => unusedFilename(testFile, {incrementer}),
				error,
				message
			);
		} else {
			t.is(
				unusedFilename.sync(testFile, {incrementer}),
				result,
				message
			);

			t.is(
				await unusedFilename(testFile, {incrementer}),
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
					return `${filename}${' - copy'.repeat(counter)}${extension}`;
				},
				result: 'fixtures/rainbow - copy - copy - copy.txt'
			}
		].map(incrementerTest)
	);
});
