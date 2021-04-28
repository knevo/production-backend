const dataService = require('./data.service')
const logger = require('../../services/logger.service')

async function getData(req, res) {
    const data = await dataService.getById(req.params.id)
    res.json(data)
}

async function getDatas(req, res) {
    const filterBy = req.query
    let datas = await dataService.query(filterBy)
    res.json(datas)
}
async function addData(req, res) {
    const data = req.body
    try {
        const addedData = await dataService.add(data)
        res.json(addedData)
    } catch (err) {
        logger.error(`[DataController] Could not add data ${data._id}`, err)
        res.status(500).send({ error: 'Could not add data' })
    }
}
async function deleteData(req, res) {
    try {
        await dataService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('[DataController][deleteData]', err)
        res.status(500).end()
    }
}

async function updateData(req, res) {
    const data = req.body;
    await dataService.update(data)
    res.json(data)
}

module.exports = {
    getData,
    getDatas,
    deleteData,
    updateData,
    addData,
}