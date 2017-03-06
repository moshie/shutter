import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;

import isJson from './is-json';

describe('JSON', () => {

    describe('#isJson()', () => {
    	let json: string;

    	beforeEach(() => {
    		json = JSON.stringify([{
    			"1": "I am some Json",
    			"2": "I am in some Json"
    		}]);
    	})

        it('should return a boolean', () => {
        	expect(isJson(json)).to.be.a('boolean');
        });

        it('should return true for valid json string', () => {
    		expect(isJson(json)).to.equal(true);
        });

        it('should return false for an invalid string', () => {
    		expect(isJson('I am not json')).to.equal(false, 'is Json should be false when a string is passed');
        });

	});

});