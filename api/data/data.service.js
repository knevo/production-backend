
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId
const COLLECTION_NAME = 'data'
module.exports = {
    query,
    getById,
    remove,
    update,
    add,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection(COLLECTION_NAME)
    try {
        const datas = await collection.find(criteria).toArray();
        return datas
    } catch (err) {
        logger.error(`[DataService] cannot query datas`)
        throw err;
    }
}

async function getById(dataId) {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    try {
        const data = await collection.findOne({ "_id": ObjectId(dataId) })
        return data
    } catch (err) {
        logger.error(`[DataService] cannot find data: ${dataId}`)
        throw err;
    }
}


async function remove(dataId) {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    try {
        await collection.deleteOne({ "_id": ObjectId(dataId) })
    } catch (err) {
        logger.error(`[DataService] cannot remove data: ${dataId}`)
        throw err;
    }
}

async function update(data) {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    data._id = ObjectId(data._id);
    try {
        await collection.updateOne({ "_id": data._id }, { $set: data })
        return data
    } catch (err) {
        logger.error(`[DataService] cannot update data: ${data._id}`)
        throw err;
    }
}

async function add(dataToAdd) {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    try {
        const res = await collection.insertOne(dataToAdd);
        const data = res.ops[0]
        return data;
    } catch (err) {
        logger.error('[DataService] [add]', err)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};

    return criteria;
}


