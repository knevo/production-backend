const MongoClient = require('mongodb').MongoClient;
const { dbName, dbURL } = require('../config')
const logger = require('./logger.service')

module.exports = {
    getCollection,
    dbConn
}

var dbConn = null;

async function getCollection(collectionName) {
    const db = await connect();
    return db.collection(collectionName);
}
async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err;
    }
}
