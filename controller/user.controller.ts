// user.controller.ts

import { Request, Response } from 'express'
import commonRes from '../utils/commonRes'
import silentHandle from '../utils/silentHandle'
import { CreateUserInput } from '../schema/user.schema'
import USER_CRUD from '../service/user.service'

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['query']>,
  res: Response
) {
  const [e, user] = await silentHandle(USER_CRUD.create, req.query)

  return e ? commonRes.error(res, null, e.message) : commonRes(res, user)
}
