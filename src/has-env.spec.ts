import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import hasEnv from './has-env';

describe('Validation', () => {

	describe('#hasEnv()', () => {

		it('should be a boolean returned', () => {
			const result = hasEnv('')
			expect(result).to.be.a('boolean')
		})

		it('should return true if either the environment or domain are not provided', () => {
			const result = hasEnv('=')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should return true if the environment is not provided', () => {
			const result = hasEnv('=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should return true if the domain is not provided', () => {
			const result = hasEnv('master=')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should return false if the value is valid', () => {
			const result = hasEnv('master=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.false
		})

	})

})