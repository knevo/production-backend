module.exports = {
  env: {
    name: 'development',
    isProduction: false,
    isStaging: false,
    isDevelopment: true,
  },
  logger: {
    level: 'debug'
  },
  dbURL: '',
  dbName: process.env.DB_NAME,
  morganFormat: function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      statusCode: tokens.status(req, res),
      userAgent: tokens['user-agent'](req),
      resTime: tokens['response-time'](req, res),
      query: tokens.query(req),
      referrer: tokens.referrer(req, res)
    })
  },
  corsOption: {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
  },
  session: {
    cookie: { maxAge: 86400000, secure: false },
    storeCheckPeriod: 86400000,
    secret: 'very important secret',
  },
}
