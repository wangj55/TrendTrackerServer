const express = require('express');
const router = express.Router();
const {getTrendsByWOEID} = require("../utils/database");

/* GET home page. */
router.get('/', async function(req, res, next) {
    const woeid = parseInt(req.query.woeid);
    const cityDocument = await getTrendsByWOEID(woeid);
    res.send(cityDocument);
});

module.exports = router;
