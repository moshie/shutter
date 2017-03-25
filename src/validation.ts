import domainValidator from './domain-validator'
import validationHandler from './validation-handler'

export function domainValidation(domains: string[]): void {

	try {
		domainValidator(domains)
	} catch (e) {

	}

    return;
}