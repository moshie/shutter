import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import isInvalid from './is-invalid';

describe('Validation', () => {

	describe('#isInvalid()', () => {

		it('should be a boolean returned', () => {
			const result = isInvalid('')
			expect(result).to.be.a('boolean')
		})

		it('should be true when nothing is passed', () => {
			const result = isInvalid('')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should be true when no = is passed in the value', () => {
			const result = isInvalid('domain')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should be true when more than one = is specified in the value', () => {
			const result = isInvalid('mas=ter=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should be true when symbols are passed in the value', () => {
			const result = isInvalid('doma^&(in=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should be true when no environment is specified in the value', () => {
			const result = isInvalid('=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should be false when a valid value is passed', () => {
			const result = isInvalid('master=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.false
		})

	})

})