import * as chai from 'chai';
const should = chai.should();
const expect = chai.expect;

import sanitizePath from './sanitize-path';

describe('String', () => {

    describe('#sanitizePath()', () => {

        it('should sanitise the path name to a usable id', () => {
            expect(sanitizePath('/testing/path')).to.equal('testing_path');
            expect(sanitizePath('testing/path/')).to.equal('testing_path');
            expect(sanitizePath('/testing/path/')).to.equal('testing_path');
            expect(sanitizePath('/')).to.equal('home');

            expect(sanitizePath('/testing/path/?search=music')).to.equal('testing_path_?search=music');
        });

	});

});