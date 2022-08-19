require("dotenv").config();

const {MongoClient, UpdateResult} = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xa7xzw8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

/**
 * Fetch target cities WOEIDs from database.
 * @returns {Promise<Number[]>} A list of city WOEID.
 */
async function getCityWOEIDs() {
    const woeidArray = [];
    const client = new MongoClient(uri);
    try {
        const database = client.db("trendData")
        const collection = database.collection("cities")
        const query = {};
        const projection = {_id: 0, woeid: 1};

        const cursor = await collection.find(query).project(projection);

        // await cursor.forEach(console.dir);
        await cursor.forEach((document) => {
            woeidArray.push(document.woeid);
        });
    } finally {
        await client.close();
    }
    return woeidArray;
}

/**
 * Update trends of a city.
 * @param WOEID The WOEID of the city.
 * @param trends The trends to be updated of the city.
 * @return {Promise<UpdateResult>} The update result.
 */
async function updateTrendByCity(WOEID, trends) {
    // console.log(`Updating city with woeid=${WOEID}`);
    const client = new MongoClient(uri);
    try {
        const database = client.db("trendData")
        const collection = database.collection("cities")
        const filter = {woeid: WOEID};
        const updateDoc = {
            $set: {
                trends: trends,
                updatedAt: new Date().toLocaleString() + ", EST"
            }
        };
        return await collection.updateOne(filter, updateDoc);
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
}

module.exports = {
    getCityWOEIDs: getCityWOEIDs,
    updateTrendByCity: updateTrendByCity
}