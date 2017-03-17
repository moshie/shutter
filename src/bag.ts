import {errorBag} from './error-bag-interface'

class Bag {

    defaultPrefix: string

    contents: errorBag[]

    constructor(defaultPrefix: string = '') {
        this.defaultPrefix = defaultPrefix;
        this.contents = []
    }

    add(message: string, prefix: string = '') {
        let defaultPrefix = !this.defaultPrefix.length ? '' : `${this.defaultPrefix}: `;
        prefix = !prefix.length ? defaultPrefix : `${prefix}: `
        this.contents.push({prefix, message})
    }

}

export default Bag