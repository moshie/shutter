/// <reference types="bluebird" />
import * as Promise from 'bluebird';
declare function hasReadAccess(filepath: string): Promise<string>;
export default hasReadAccess;
