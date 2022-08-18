/**
 * This function is to retrieve data from third-party APIs and update to database.
 *
 * 1. Get target list of cities from database
 * 2. Retrieve trends in these cities
 * 3. Update trends of cities to database
 */

const {getCityWOEIDs, updateTrendByCity} = require("./database");
const {getTrendsByCity} = require("./twitter");

getCityWOEIDs().then((WOEIDs) => {
    console.log(`WOEIDs: ${WOEIDs}`);
    WOEIDs.forEach((WOEID) => {
        getTrendsByCity(WOEID).then((trends) => {
            updateTrendByCity(WOEID, trends);
        });
    });
});