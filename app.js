const app = require('./server');
const logger = require('./services/logger.service')

const port = process.env.PORT || 3030;

app.listen(port, () => {
  logger.info('Server is running on port: ' + port)
});
