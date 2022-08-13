// utils/dbConnect.ts

// 连接db

import mongoose from 'mongoose'
import config from 'config'
import logger from './logger'

async function dbConnect() {
  const dbUrl = config.get<string>('dbUrl')
  const dbUser = config.get<string>('dbUser')
  const dbPassword = config.get<string>('dbPassword')
  const dbAuthSource = config.get<string>('dbAuthSource')

  try {
    const connection = await mongoose.connect(dbUrl, {
      user: dbUser,
      pass: dbPassword,
      // authSource: Define the database to authenticate against
      authSource: dbAuthSource,
    })

    logger.info('DB connected')

    return connection
  } catch (error) {
    logger.error('Could not connect to db')
    process.exit(1)
  }
}

export default dbConnect
