//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const app = require("../app")

let chai = require('chai')
let chaiHttp = require('chai-http')
chai.should()
chai.use(chaiHttp)

function isValidCityObject(object) {
    const requiredProperties = ["name", "country", "woeid", "countryCode"]
    object.should.be.an("object")
    requiredProperties.forEach((property) => {
        object.should.have.property(property)
    })
}

describe("Test /cities endpoint", () => {
    function isValidCityDocument (document) {
        document.should.be.an("array")
        document.forEach((object) => {
            isValidCityObject(object)
        })
    }


    describe("GET /", () => {
        it("should GET all the cities", (done) => {
            chai.request(app)
                .get("/cities")
                .end((err, res) => {
                    res.should.have.status(200)
                    isValidCityDocument(res.body)
                    done()
                })
        })
    })

    describe("GET /info", () => {
        it("should GET all cities info", (done) => {
            chai.request(app)
                .get("/cities/info")
                .end((err, res) => {
                    res.should.have.status(200)
                    isValidCityDocument(res.body)
                    done()
                })
        })
    })

    describe("GET /woeid", () => {
        it("should GET all cities woeid only", (done) => {
            chai.request(app)
                .get("/cities/woeid")
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an("array")
                    res.body.forEach((item) => {
                        item.should.be.a("number")
                    })
                    done()
                })
        })
    })
})

describe("Test /trends endpoint", () => {
    describe("GET /", () => {
        let validWoeids

        before((done) => {
            chai.request(app)
                .get("/cities/woeid")
                .end((err, res) => {
                    validWoeids = res.body
                    done()
                })
        })

        it("should GET city trends and info by valid WOEID", (done) => {
            validWoeids.forEach((validWoeid) => {
                chai.request(app)
                    .get(`/trends?woeid=${validWoeid}`)
                    .end((err, res) => {
                        res.should.have.status(200)
                        isValidCityObject(res.body)
                        res.body.woeid.should.equal(validWoeid)
                        res.body.should.have.property("trends")
                        res.body.trends.should.be.an("array")
                        done()
                    })
            })
        })

        it("should return 404 not found for non-existing WOEID", (done) => {
            const invalidWoeid = 0
            chai.request(app)
                .get(`/trends/?woeid=${invalidWoeid}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })
    })
})