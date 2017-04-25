import * as path from 'path'
import { Duplex } from 'stream'

class Compare extends Duplex {

    constructor(directory: string = process.cwd()) {
        directory = directory[0] === '~' ? path.join(process.env.HOME, directory.slice(1)) : directory;
        super({ writableObjectMode: true, readableObjectMode: true })
    }

    _write(screenshots: string, encoding: null|string, callback: () => void) {
        // screenshots = \/
        // {
        //     original: ['/path/'],
        //     comparison: ['/path/'],
        //     develop: ['/']
        // }

        // this.queue((next) => {
        //     this.compare(screenshots).then(() => next())
        // })
    }

    compare(screenshots): any {

    }

}

export default Compare