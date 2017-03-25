import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import isEmpty from './is-empty';

describe('Validation', () => {

	describe('#isEmpty()', () => {

		it('should be a boolean returned', () => {
			const result = isEmpty([])
			expect(result).to.be.a('boolean')
		})

		it('should return true if the array is empty', () => {
			const result = isEmpty([])
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should return false if the array is not empty', () => {
			const result = isEmpty(['domain', 'domain'])
			expect(result).to.be.a('boolean')
			expect(result).to.be.false
		})

	})

})