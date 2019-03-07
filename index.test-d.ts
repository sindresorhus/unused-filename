import {expectType} from 'tsd-check';
import unusedFilename from '.';

expectType<Promise<string>>(unusedFilename('rainbow.txt'));
expectType<string>(unusedFilename.sync('rainbow.txt'));
