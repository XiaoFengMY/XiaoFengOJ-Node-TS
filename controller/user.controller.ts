import { CaptchaDocument } from './../models/captcha.model'
// user.controller.ts

import { Request, Response } from 'express'
import { commonRes, silentHandle } from '../utils'
import { CreateUserInput } from '../schema/user.schema'
import { USER_CRUD, CaptchaCRUD } from '../service'

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) {
  const [errs, captcha] = await silentHandle(
    CaptchaCRUD.findOne,
    {
      phone: req.body.phone,
    },
    { Id: 1, captcha: 1 },
    { sort: '-Id' }
  )
  if (captcha != false) {
    let nowTime: number = Date.parse(new Date().toString())
    // 这里的any 需要修改
    let resDate: any = captcha
    let captchaTime = resDate[0].Id
    if (
      nowTime - captchaTime <= 60000 &&
      resDate[0].captcha == req.body.captcha
    ) {
      const [e, user] = await silentHandle(USER_CRUD.create, req.body)
      return e ? commonRes.error(res, null, '注册失败') : commonRes(res, user)
    }
  } else if (errs) {
    commonRes.error(res, null, '注册失败')
  }
}

export async function getCaptchaHandler(req: Request, res: Response) {
  var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/
  let isPhone: boolean = reg.test(req.body.phone)
  if (!isPhone) {
    return commonRes.error(res, null, '请输入正确的手机号！')
  }
  if (req.body.type == 'regist') {
    const [e, user] = await silentHandle(USER_CRUD.find, {
      phone: req.body.phone,
    })
    if (user != false) {
      console.log('user', user)
      return commonRes.error(res, null, '该手机号已注册！')
    } else if (e) {
      commonRes.error(res, null, e.message)
    }
  }
  let randomNum: string = Math.random().toFixed(6).slice(-6)
  const data = {
    phone: req.body.phone,
    captcha: randomNum,
  }
  const [err, captcha] = await silentHandle(CaptchaCRUD.create, data)
  return err ? commonRes.error(res, null, err.message) : commonRes(res, captcha)
}
