import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import hasSymbols from './has-symbols';

describe('Validation', () => {

	describe('#hasSymbols()', () => {

		it('should be a boolean returned', () => {
			const result = hasSymbols('')
			expect(result).to.be.a('boolean')
		})

		it('should return true if the environment value contains symbols', () => {
			const result = hasSymbols('mast&*(_!@£er=http://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.true
		})

		it('should return false if the environment value does not contain symbols', () => {
			const result = hasSymbols('domain=https://google.com')
			expect(result).to.be.a('boolean')
			expect(result).to.be.false
		})

	})

})