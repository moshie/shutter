import validation from './validation'
import {environmentsInterface} from './environments-interface'

function sanitize(rawEnvironments: string[]) {

	try {
		validation(rawEnvironments)
	} catch (error) {
		console.log(error.message) // TODO: Swap out for error handler
		process.exit(1)
	}

    let sanitized: environmentsInterface = {};

    for (var i = rawEnvironments.length - 1; i >= 0; i--) {
        let [environment, domain] = rawEnvironments[i].split('=')
        domain = /^(https?)/.test(domain) ? domain : `http://${domain}`
        domain = domain[domain.length-1] == '/' ? domain : `${domain}/`
        sanitized[environment] = domain
    }

    return sanitized
}

export default sanitize