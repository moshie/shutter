import * as Promise from 'bluebird'
import {environmentsInterface} from '../cli/environments-interface'

interface CapturerInterface {
    environments: environmentsInterface;
    capture(chunkFilename: string, environment: string): Promise<string>;
}

export default CapturerInterface