import {expectType} from 'tsd';
import {unusedFilename, unusedFilenameSync, MaxTryError} from './index.js';

expectType<Promise<string>>(unusedFilename('rainbow.txt'));
expectType<string>(unusedFilenameSync('rainbow.txt'));

let error: unknown;
if (error instanceof MaxTryError) {
	expectType<string>(error.lastTriedPath);
}
