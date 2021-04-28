module.exports = {
  env: {
    name: 'staging',
    isProduction: false,
    isStaging: true,
    isDevelopment: false,
  },
  logger: {
    level: 'debug'
  },
  dbURL: process.env.DB_URL,
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
  session: {
    cookie: { maxAge: 86400000, secure: true },
    storeCheckPeriod: 86400000,
    secret: process.env.SESSION_SECRET,
  }
}
