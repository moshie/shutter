import validation from './validation'
import {environmentsInterface} from './environments-interface'

function sanitize(rawEnvironments: string[]) {

	try {
		validation(rawEnvironments)
	} catch (error) {
		console.log(error) // TODO: Swap out for error handler
		process.exit(1)
	}

    let sanitized: environmentsInterface = {};

    for (var i = rawEnvironments.length - 1; i >= 0; i--) {
        let [environment, domain] = rawEnvironments[i].split('=')
        sanitized[environment] = domain
    }

    return sanitized
}

export default sanitize