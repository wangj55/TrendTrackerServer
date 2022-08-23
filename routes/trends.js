const express = require('express')
const router = express.Router()
const {getTrendsByWOEID} = require("../utils/database")

/* GET /trends */
router.get('/', async function(req, res, next) {
    const woeid = parseInt(req.query.woeid)
    const cityDocument = await getTrendsByWOEID(woeid)
    if (!cityDocument) {
        res.status(404).send(`Unable to find city with WOEID=${woeid}`)
    } else {
        res.send(cityDocument)
    }
})

module.exports = router
