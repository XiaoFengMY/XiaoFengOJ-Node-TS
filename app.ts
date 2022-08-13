// src/app.ts

import express from 'express'
import config from 'config'
import routes from './routes' // 路由
import initMiddleware from './middleware'
import dbConnect from './utils/dbConnect'
import logger from './utils/logger'

const app = express()

// 挂载中间件
initMiddleware(app)

app.use(express.json())

const PORT = config.get<number>('port')

// 启动
app.listen(PORT, async () => {
  logger.info(`App is running at http://localhost:${PORT}`)

  await dbConnect()

  routes(app)
})
