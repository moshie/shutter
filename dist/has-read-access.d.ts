/// <reference types="bluebird" />
import * as Promise from 'bluebird';
declare function hasReadAccess(chunkFilepath: string): Promise<string>;
export default hasReadAccess;
