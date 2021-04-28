const logger = require('../services/logger.service')

const errorHandler = (err, req, res, next) => {
    if (typeof (err) === 'string') {
        // custom application error
        logger.error('[ERROR-HANDLER] ' + err)
        return res.status(400).json({ message: err })
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        logger.info('[ERROR-HANDLER] ' + err.name)
        return res.status(401).json({ message: 'Invalid Token' })
    }

    // default to 500 server error
    logger.error('[ERROR-HANDLER] ' + err.message)
    return res.status(500).json({ message: err.message })
}


module.exports = errorHandler

