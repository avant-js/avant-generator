process.env.NODE_ENV = 'test';

const chai = require('chai');
const server = require('../index');
const expect = chai.expect;

describe('My avantjs test case', () => {
    beforeEach((done) => {
        //Do before tests
    });
    describe('My test', () => {
        it('it expects something', (done) => {
            //Run yout tests here
        });
    });
});
