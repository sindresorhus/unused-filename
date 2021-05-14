import {expectType} from 'tsd';
import unusedFilename = require('./index.js');

expectType<Promise<string>>(unusedFilename('rainbow.txt'));
expectType<string>(unusedFilename.sync('rainbow.txt'));
