const express = require('express')
const router = express.Router()
const {getCitiesProjection} = require('../utils/database')

/* GET /cities */
router.get("/", async (req, res, next) => {
    const cities = await getCitiesProjection()
    res.send(cities)
})

module.exports = router