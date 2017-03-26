/// <reference types="bluebird" />
import { environmentsInterface } from './environments-interface';
import * as Promise from 'bluebird';
declare function screenshotChunk(environments: environmentsInterface, chunk: string[], index: number): Promise<any>;
export default screenshotChunk;
