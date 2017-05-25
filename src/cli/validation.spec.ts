import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;

import validation, {hasEnv, hasSymbols, isInvalid} from './validation';

describe('Validation', () => {

    it('checks if an environment is present', () => {
        expect(hasEnv('master=http://www.google.com')).to.be.a('boolean')
        expect(hasEnv('master=http://www.google.com')).to.be.true
        expect(hasEnv('=http://www.google.com')).to.be.false
        expect(hasEnv('=')).to.be.false
        expect(hasEnv('')).to.be.false
        expect(hasEnv('master=')).to.be.false
    })

    it('checks vadility of an environment', () => {
        expect(isInvalid('master=http://www.google.com')).to.be.a('boolean')
        expect(isInvalid('master=http://www.google.com')).to.be.false
        expect(isInvalid('=')).to.be.true
        expect(isInvalid('master=')).to.be.true
        expect(isInvalid('mast=er=http://google.com')).to.be.true
        expect(isInvalid('masterhttp://google.com')).to.be.true
        expect(isInvalid('')).to.be.true
        expect(isInvalid('=http://www.google.com')).to.be.true
    })

    it('checks if the environment contains symbols', () => {
        expect(hasSymbols('master=http://www.google.com')).to.be.a('boolean')
        expect(hasSymbols('master=http://www.google.com')).to.be.false
        expect(hasSymbols('mas"\'@!~`t#$%^&()er=http://www.google.com')).to.be.true
    })

})
