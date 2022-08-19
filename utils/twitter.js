require("dotenv").config();

const Twitter = require("twitter");

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Fetch trends of a city.
 * @param WOEID The WOEID of the target city.
 */
async function getTrendsByCity(WOEID) {
    try {
        const res = await client.get("trends/place.json", {id: WOEID});
        return res[0]?.trends ?? [];
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    getTrendsByCity: getTrendsByCity
}