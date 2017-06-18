import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import Sanitizer from './sanitizer';

describe('#Sanitizer', function () {

    it('Should not have duplicates', function () {
        let sanitizer = new Sanitizer(['master=example.com', 'master=example.com'])
        sanitizer.environments = ['master=example.com', 'master=example.com']
        let removedDuplicates = sanitizer.removeDuplicates()
        
        expect(removedDuplicates).to.be.an('array')
        expect(removedDuplicates).to.include('master=example.com')
        expect(removedDuplicates.length).to.equal(1);
    })

    it('should add a trailing slash to urls', function () {
        let sanitizer = new Sanitizer(['master=example.com', 'staging=staging.example.com'])

        expect(sanitizer.sanitized).to.be.an('object')
        expect(sanitizer.sanitized.master).to.be.a('string')
        expect(sanitizer.sanitized.staging).to.be.a('string')

        expect(sanitizer.sanitized.master[sanitizer.sanitized.master.length - 1]).to.equal('/')
        expect(sanitizer.sanitized.staging[sanitizer.sanitized.staging.length - 1]).to.equal('/')
    })

    it('should add the correct protocol', function () {
        let sanitizer = new Sanitizer([
            'master=example.com', 
            'staging=https://staging.example.com',
            'develop=http://develop.example.com'
        ])

        expect(sanitizer.sanitized).to.be.an('object')
        expect(sanitizer.sanitized.master).to.be.a('string')
        expect(sanitizer.sanitized.staging).to.be.a('string')
        expect(sanitizer.sanitized.develop).to.be.a('string')

        expect(sanitizer.sanitized.master).to.equal('http://example.com/')
        expect(sanitizer.sanitized.staging).to.equal('https://staging.example.com/')
        expect(sanitizer.sanitized.develop).to.equal('http://develop.example.com/')
    })

    it('should return the correct sanatized object', function () {
        let sanitizer = new Sanitizer([
            'master=example.com', 
            'staging=https://staging.example.com',
            'develop=http://develop.example.com'
        ])

        expect(sanitizer.sanitized).to.be.an('object')
        expect(sanitizer.sanitized).to.include({
            master: 'http://example.com/',
            staging: 'https://staging.example.com/',
            develop: 'http://develop.example.com/'
        })
    })

})