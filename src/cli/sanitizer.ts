import {environmentsInterface} from './environments-interface'

function sanitize(rawEnvironments: string[]) {
    let sanitized: environmentsInterface = {};
    
    for (var i = rawEnvironments.length - 1; i >= 0; i--) {
        let [environment, domain] = rawEnvironments[i].split('=')
        sanitized[environment] = domain
    }

    return sanitized
}

export default sanitize