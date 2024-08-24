import app from "./app"
import config from "./config/config"
import logger from "./util/logger"
import databaseService from "./service/databaseService"

const server = app.listen(config.PORT)

void (async () => {
  try {
    //database connection
    const connection = await databaseService.connect()
    logger.info(`DATABASE_CONNECTED`, {
      meta: { HOST: connection.host, PORT: connection.port, NAME: connection.name }
    })
    logger.info(`APPLICATION_STARTED`, {
      meta: { PORT: config.PORT, NODE_ENV: config.ENV, SERVER_URL: config.SERVER_URL }
    })
  } catch (err) {
    logger.error(`APPLICATION_ERROR`, {
      meta: err
    })
    server.close((err) => {
      if (err) {
        logger.error(`APPLICATION_ERROR`, {
          meta: err
        })
      }
      process.exit(1)
    })
  }
})()

