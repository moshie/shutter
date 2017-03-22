/// <reference types="bluebird" />
import * as Promise from 'bluebird';
import { environmentsInterface } from './environments-interface';
declare function crawl(environments: environmentsInterface): Promise<any>;
export default crawl;
