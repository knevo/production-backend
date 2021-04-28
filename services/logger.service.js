const fs = require('fs')
const { createLogger, format: { printf }, transports, format } = require('winston')
const cls = require('cls-hooked')
const config = require('../config');
const morgan = require('morgan');
const { removeEmptyFields } = require('./utils');

const logsdir = './logs';
if (!fs.existsSync(logsdir)) {
    fs.mkdirSync(logsdir);
}

//define the time format
const timeFormatFn = () => {
    let now = new Date();
    return now.toLocaleString('en-Gb');
};

const addData = format((info) => {
    const clsNamespace = cls.getNamespace('app')
    const traceID = clsNamespace.get('traceID')
    const user = clsNamespace.get('user')
    if (traceID) {
        info.traceID = traceID
    }
    if (user) {
        info.user = user
    }
    info.level = info.level.toUpperCase()
    info.timestamp = timeFormatFn()
    return info
})

const simpleFormat = printf(({ level, message, meta: { timestamp, stack = '', traceID = 'None', source } = {} }) => {
    return `[trace-id: ${traceID}] [${timestamp}] ${source === 'frontend' ? `[${source.toUpperCase()}]` : ''} ${level.toUpperCase()} - ${message} `
})
const logger = createLogger({
    level: config.logger.level,
    format: format.combine(
        addData(),
        format.errors({ stack: true }),
        format.metadata({ key: 'meta' }),
        format.json()
    ),
    defaultMeta: { enviroment: config.env.name, source: 'backend' }, // change it to the service name
    transports: [
        new transports.Console({
            format: simpleFormat,
            level: config.logger.level
        })
    ]
})

if (config.env.isDevelopment) {
    logger.add(new transports.File({ filename: 'logs/log.log' }))
}

module.exports = {
    debug: (message, meta = {}) => {
        logger.log('debug', message, meta)
    },
    info: (message, meta = {}) => {
        logger.log('info', message, meta)
    },
    warn: (message, meta = {}) => {
        logger.log('warn', message, meta)
    },
    error: (message, meta = {}) => {
        logger.log('error', message, meta)
    },
    front: (level, message, meta = {}) => {
        logger.log(level, message, { ...meta, source: 'frontend' })
    }
}


module.exports.getMorgan = () => {
    morgan.token('query', req => Object.values(req.query).length ? req.query : null)

    const httpStream = {
        write: function (message) {
            const meta = removeEmptyFields(JSON.parse(message))
            logger.log('http', `${meta.method} - ${meta.url} ${meta.statusCode} - ${meta.resTime} ms`, meta);
        }
    }
    const isLogSkipped = (req) => {
        if (req.method === 'OPTIONS') return true
    }
    const morganOptions = {
        stream: httpStream,
        skip: isLogSkipped
    }

    return morgan(config.morganFormat, morganOptions)
}