import * as mock from 'mock-fs'
import * as chai from 'chai'
const should = chai.should()
const expect = chai.expect

import hasReadAccess from './has-read-access'

describe('Promise', () => {

    describe('#hasReadAccess()', () => {

        beforeEach(function() {
            mock({
                'chunk-0.json': JSON.stringify([{
                    domain: 'https://google.com/',
                    environment: 'master',
                    chunk: ['chunk1', 'chunk2']
                }])
            })
        })

        it('should return the filepath', (done) => {
            hasReadAccess('chunk-0.json')
                .then((filepath) => {
                    expect(filepath).to.be.a(
                        'string',
                        'filepath should return a string'
                    )
                    expect(filepath).to.equal(
                        'chunk-0.json',
                        'filepath should return back the filepath'
                    )
                    done();
                })
        })

        it('should fail with the loggable error string', () => {
            hasReadAccess('fail.json')
                .catch((error) => {
                    expect(error).to.be.a(
                        'string',
                        'has read access should error with a type of string'
                    )
                    expect(error).to.equal(
                        'No Read access to fail.json',
                        'has read access should error with "No Read access to fail.json"'
                    )
                })
        })

        afterEach(mock.restore)

	})

})