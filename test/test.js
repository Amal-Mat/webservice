const supertest = require('supertest');
const app = require('../index.js');
const should = require('should');
const assert = require('assert');

//const app = supertest.agent(`http://localhost:${process.env.PORT}`);

describe("First Unit Test", () => {
    //console.log(typeof app);
    it("should return response code 200", (done) => {
        supertest(app).get("/healthz").expect(200).end((err, res) => {
            if (err) return done(err);
            //res.status.should.equal(200);
            return done();
        });

    });
});