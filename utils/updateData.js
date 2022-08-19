/**
 * This function is to retrieve data from third-party APIs and update to database.
 *
 * 1. Get target list of cities from database
 * 2. Retrieve trends in these cities
 * 3. Update trends of cities to database
 */

const {getCityWOEIDs, updateTrendByCity} = require("./database");
const {getTrendsByCity} = require("./twitter");

updateTrends();

async function updateTrends() {
    const WOEIDs = await getCityWOEIDs();
    console.log(`Retrieved woeids from database: ${WOEIDs}`);
    let matchedCount = 0;
    let modifiedCount = 0;
    for (const WOEID of WOEIDs) {
        const trends = await getTrendsByCity(WOEID);
        const result = await updateTrendByCity(WOEID, trends);
        matchedCount += result.matchedCount;
        modifiedCount += result.modifiedCount;
    }
    console.log(`${matchedCount} document(s) matched the filter, updated ${modifiedCount} document(s), ${new Date().toLocaleString()}, EST`);
}

module.exports = {
    updateTrends: updateTrends
}