/// <reference types="bluebird" />
import * as Promise from 'bluebird';
declare function checkPathsAreDirectories(...paths: string[]): Promise<any>;
export default checkPathsAreDirectories;
