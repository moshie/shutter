"use strict"

class Validator {

    environments: string[]

    bag: any[] = []

    constructor (environments: string[]) {
        this.environments = environments;
        this.validate()
    }

    validate() {
        this.checkEmpty()
        for (var i = this.environments.length - 1; i >= 0; i--) {
            let environment: string = this.environments[i];
            this.hasEquals(environment)
            this.hasSymbols(environment)
            this.hasEnvironment(environment)
        }

        // this.checkDuplicates() Should be part of sanitation
    }

    hasEquals(environment: string): boolean {
        let equalsMatches: null|string[] = environment.match(/(\=)/g)
        let equals = equalsMatches === null || equalsMatches.length > 1;
        
        if (equals) {
            this.pushError('Oops!', 'Equals')
        }

        return equals
    }

    checkEmpty(): boolean {
        let empty = !this.environments.length

        if (empty) {
            this.pushError('Oops!', 'Please supply at least one environment!')
        }

        return empty;
    }

    checkDuplicates() {
        // Sanitizing
        let envs = this.environments.map((elem) => elem.split('=')[0])
        this.environments.filter((elem, index, arr) => index == envs.indexOf(elem.split('=')[0]))
    }

    pushError(title: string = "Error!", message: string = "Something went wrong 😔") {
        this.bag.push({ title, message })
    }

    get valid(): boolean {
        return !this.bag.length
    }

}

export default Validator