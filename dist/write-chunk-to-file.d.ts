/// <reference types="bluebird" />
import * as Promise from 'bluebird';
declare function writeChunkToFile(filename: string, contents: string): Promise<string>;
export default writeChunkToFile;
