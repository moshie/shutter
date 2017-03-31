import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
import chunk from './chunk';

describe('Array', () => {
    describe('#chunk()', () => {

        it('chunk should be a function', () => {
            chunk.should.be.a('function', 'chunk is not a function');
        });

        it('should return an array of 2 array chunks', () => {
            const array: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
            const chunks = chunk(array, 8);

            expect(chunks).to.be.a('array');
            expect(chunks[0]).to.be.a('array');
            expect(chunks[0]).to.include.members([1,2,3,4,5,6,7,8]);

            expect(chunks[1]).to.be.a('array');
            expect(chunks[1]).to.include.members([9,10,11,12,13,14,15,16]);

            expect(chunks[2]).to.be.an('undefined');
        });

    });
});