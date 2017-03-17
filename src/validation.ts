import Bag from './Bag'
import domainValidator from './domain-validator'
import validationHandler from './validation-handler'

export function screenShotsValidation(domains: string[]): void {
    let bag: Bag = domainValidator(domains)
    if (validationHandler(bag)) {
        process.exit();
    }

    return;
}