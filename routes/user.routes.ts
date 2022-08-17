import { Router } from 'express'
import {
  createUserHandler,
  loginUserHandler,
  getCaptchaHandler,
} from '../controller/user.controller'
import validate from '../middleware/validate'
import {
  createUserSchema,
  loginUserSchema,
  getCaptchaSchema,
} from '../schema/user.schema'

const router = Router()

// 需要校验接口参数的，加上校验中间件
router.post('/create', validate(createUserSchema), createUserHandler)

router.post('/login', validate(loginUserSchema), loginUserHandler)

router.post('/getCaptcha', validate(getCaptchaSchema), getCaptchaHandler)

export default router
