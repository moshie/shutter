import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;

import Validator from './validator';

describe('#Validator', function () {

    it('should add an item to the bag if the input is empty', function () {
        let validator = new Validator([])
        expect(validator.bag).to.be.an('array')
        expect(validator.bag.length).to.equal(1)
        expect(validator.bag[0]).to.deep.equal({ 
            title: 'Oops!',
            message: 'Please supply at least one environment!' 
        })
        expect(validator.valid).to.be.false
    })

    it('should add an item to the bag if the equals is not present', function () {
        let validator = new Validator(['mastergoogle.com'])
        expect(validator.bag).to.be.an('array')
        expect(validator.bag.length).to.equal(1)
        expect(validator.bag[0]).to.deep.equal({ 
            title: 'Oops!',
            message: 'Please provide an equals between your environment and domain.' 
        })

        expect(validator.valid).to.be.false
    })

    it('should add an item to the bag if the environment contains symbols', function () {
        let validator = new Validator(['master=example.com'])
        let tests = [
            '*', '?', '&', '£', '#', '@', '!', '^', ')', '(', '_',
            '+',  '/', '\\', '}', '{', '[', ']', '|', '\'',
            '"', ';', ':', '~', '`', '`', '±', '§'
        ]
        for (var i = tests.length - 1; i >= 0; i--) {
            expect(validator.hasSymbols(`ma${tests[i]}ster=example.com`), 'Ah no symbol ' + tests[i] + ' failed').to.be.true
        }
    })

    it('should have one equals', function () {
        let validator = new Validator(['mas=ter=example.com'])
        expect(validator.bag).to.be.an('array')
        expect(validator.bag[0]).to.deep.equal({
            title: 'Oops!',
            message: 'Please provide an equals between your environment and domain.'
        })
        expect(validator.hasEquals('mas=ter=example.com')).to.be.a('boolean')
        expect(validator.hasEquals('mas=ter=example.com')).to.be.true
        expect(validator.hasEquals('master=example.com')).to.be.false
    })

})