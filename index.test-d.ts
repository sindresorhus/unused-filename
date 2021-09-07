import {expectType} from 'tsd';
import unusedFilename = require('./index.js');

expectType<Promise<string>>(unusedFilename('rainbow.txt'));
expectType<string>(unusedFilename.sync('rainbow.txt'));

let error: unknown;
if (error instanceof unusedFilename.MaxTryError) {
	expectType<string>(error.lastTriedPath);
}
