import mongoose from "mongoose"
import config from "../config/config"
import logger from "../util/logger"

export default {
  connect: async () => {
    try {
      await mongoose.connect(config.DATABASE_URL as string)
      return mongoose.connection
    } catch (err) {
      logger.error(`DATABASE_ERROR`, {
        meta: err
      })
      throw err
    }
  }
}

