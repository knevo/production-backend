const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const mongoSanitize = require('express-mongo-sanitize');
const app = express();


const logger = require('./services/logger.service')
const traceId = require('./middlewares/traceId.middleware')
const errorHandler = require('./middlewares/errorHandler.middleware')


const dataRoutes = require('./api/data/data.routes');

const config = require('./config');
// Express App Config

app.use(session({
    secret: config.session.secret,
    cookie: config.session.cookie,
    store: new MemoryStore({
        checkPeriod: config.session.storeCheckPeriod // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: true
}))


app.use(logger.getMorgan())

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '500kb'
}));

app.use(mongoSanitize());

if (config.env.isDevelopment) {
    app.use(cors(config.corsOption));
}

app.use(traceId)

app.use('/api/data', dataRoutes);


app.use(express.static(path.resolve(__dirname, 'public')));


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);


module.exports = app
