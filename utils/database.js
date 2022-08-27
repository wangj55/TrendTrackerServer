require("dotenv").config();

const {MongoClient, UpdateResult} = require('mongodb');

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xa7xzw8.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);

/**
 * Fetch target cities from database.
 * @param projection The projection object if you want projected document. e.g {woeid: 1}
 * @return {Promise<*[]>} Cities projection.
 */
async function getCitiesProjection(projection = {}) {
    // const woeidArray = [];
    const client = new MongoClient(uri);
    try {
        const database = client.db("trendData");
        const collection = database.collection("cities");
        const query = {};

        let cursor = await collection.find(query).project(projection)
        if (Object.keys(projection).length >= 0) {
            cursor = await cursor.project(projection)
        }

        // await cursor.forEach(console.dir);
        // await cursor.forEach((document) => {
        //     woeidArray.push(document.woeid);
        // });
        // console.log(await cursor.toArray())
        return await cursor.toArray()
    } finally {
        await client.close();
    }
    // return woeidArray;
}

/**
 * Fetch all WOEIDs from database.
 * @return {Promise<(number|*)[]>} An array of WOEIDs.
 */
async function getCitiesWoeids() {
    const documents = await getCitiesProjection({woeid: 1})
    // console.log(`document = ${documents}`)
    return documents.map(object => object.woeid)
}

/**
 * Get cities information, excluding trends.
 * @return {Promise<*[]>} An array of cities information.
 */
async function getCitiesInfo() {
    return await getCitiesProjection({trends: 0})
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
        const database = client.db("trendData");
        const collection = database.collection("cities");
        const filter = {woeid: WOEID};
        const updateDoc = {
            $set: {
                trends: trends,
                updatedAt: new Date().toLocaleString("en-US", {timeZone: "EST"}) + ", EST"
            }
        };
        return await collection.updateOne(filter, updateDoc);
    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
}

/**
 * Get the trends of a city by WOEID from database.
 * @param WOEID The WOEID of a city.
 * @return {Promise<Document & {_id: InferIdType<Document>}>} A document about the city including trends.
 */
async function getTrendsByWOEID(WOEID) {
    const client = new MongoClient(uri);
    try {
        const database = client.db("trendData");
        const collection = database.collection("cities");
        const query = {woeid: WOEID};
        return await collection.findOne(query);
    } catch (e) {
        console.log(e.message);
    } finally {
        await client.close();
    }
}

module.exports = {
    getCitiesProjection: getCitiesProjection,
    getCitiesWoeids: getCitiesWoeids,
    getCitiesInfo: getCitiesInfo,
    updateTrendByCity: updateTrendByCity,
    getTrendsByWOEID: getTrendsByWOEID
}