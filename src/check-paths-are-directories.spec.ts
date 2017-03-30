import * as mock from 'mock-fs'
import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
import checkPathsAreDirectories from './check-paths-are-directories';

describe('#checkPathsAreDirectories()', () => {

	beforeEach(function() {
        mock({
            'original': {
    			'some-file.txt': 'file content here'
  			},
  			'comparison': {
				'some-file.txt': 'file content here'
  			}
        })
    })

	it('checkPathsAreDirectories should be a function', () => {
	    checkPathsAreDirectories.should.be.a('function', 'checkPathsAreDirectories is not a function');
	})

	it('should return back the paths', (done) => {
		checkPathsAreDirectories('original', 'comparison')
			.then((paths: string[]) => {
				expect(paths).to.be.an.instanceof(Array)
				expect(paths).to.include.members(['original', 'comparison'])
				done();
			})

	})

	it('should fail with custom message', (done) => {
		checkPathsAreDirectories('notdirectory')
			.catch((error) => {
				assert.isString(error)
				expect(error).to.equal(`notdirectory is not a directory`)
				done();
			})
	})

	afterEach(mock.restore)

})