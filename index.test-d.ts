import {expectType} from 'tsd';
import unusedFilename = require('.');

expectType<Promise<string>>(unusedFilename('rainbow.txt'));
expectType<string>(unusedFilename.sync('rainbow.txt'));
