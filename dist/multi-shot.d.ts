/// <reference types="bluebird" />
import { environmentsInterface } from './environments-interface';
import * as Promise from 'bluebird';
declare function multiShot(environments: environmentsInterface, chunkFilename: string): Promise<string>;
export default multiShot;
