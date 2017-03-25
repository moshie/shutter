import { log } from './log-interface';
declare class Bag {
    defaultPrefix: string;
    contents: log[];
    constructor(defaultPrefix?: string);
    add(message: string, prefix?: string): void;
}
export default Bag;
