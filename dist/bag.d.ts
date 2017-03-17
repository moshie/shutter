import { errorBag } from './error-bag-interface';
declare class Bag {
    defaultPrefix: string;
    contents: errorBag[];
    constructor(defaultPrefix?: string);
    add(message: string, prefix?: string): void;
}
export default Bag;
