const express = require('express')
const router = express.Router()
const {getCitiesProjection, getCitiesWoeids, getCitiesInfo} = require('../utils/database')

/* GET /cities */
router.get("/", async (req, res, next) => {
    const cities = await getCitiesProjection()
    res.send(cities)
})

/* GET /cities/woeid */
router.get("/woeid", async (req, res, next) => {
    const woeids = await getCitiesWoeids()
    res.send(woeids)
})

/* GET /cities/info */
router.get("/info", async (req, res, next) => {
    const citiesInfo = await getCitiesInfo()
    res.send(citiesInfo)
})

module.exports = router