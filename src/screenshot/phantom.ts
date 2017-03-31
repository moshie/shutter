import {environmentsInterface} from '../cli/environments-interface'
import * as Promise from 'bluebird'
import CapturerInterface from './capturer-interface'

class Phantom implements CapturerInterface {

    environments: environmentsInterface

    constructor(environments: environmentsInterface) {
        this.environments = environments;
    }

    capture(chunkFilename: string, environment: string): Promise<string> {
        let domain: string = this.environments[environment]
        // implement phantom-shell
    }

}

export default Phantom