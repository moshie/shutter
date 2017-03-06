/// <reference types="bluebird" />
import * as Promise from 'bluebird';
declare function screenshot(chunkFilepath: string, domain: string, environment: string): Promise<any>;
export default screenshot;
