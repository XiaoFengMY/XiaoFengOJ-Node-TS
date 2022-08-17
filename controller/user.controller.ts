import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'
import { commonRes, silentHandle } from '../utils'
import { CreateUserInput } from '../schema/user.schema'
import { USER_CRUD, CaptchaCRUD } from '../service'

const jwtKey = config.get<string>('jwtKey')

export async function createUserHandler(
  req: Request<object, object, CreateUserInput['body']>,
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
    const nowTime: number = Date.parse(new Date().toString())
    // 这里的any 需要修改
    const resDate: any = captcha
    const captchaTime = resDate[0].Id
    if (
      nowTime - captchaTime <= 180000 &&
      resDate[0].captcha == req.body.captcha
    ) {
      const [e, user] = await silentHandle(USER_CRUD.create, req.body)
      return e
        ? commonRes.error(res, null, '注册失败')
        : commonRes(res, {}, { message: '注册成功' })
    } else if (
      nowTime - captchaTime > 180000 &&
      resDate[0].captcha == req.body.captcha
    ) {
      return commonRes.error(res, null, '验证码过期')
    } else if (resDate[0].captcha != req.body.captcha) {
      return commonRes.error(res, null, '验证码错误')
    }
  } else if (errs) {
    return commonRes.error(res, null, '注册失败')
  }
}

export async function loginUserHandler(req: Request, res: Response) {
  if (req.body.key == 'password') {
    const [e, user] = await silentHandle(USER_CRUD.find, {
      phone: req.body.phone,
    })
    if (user != false) {
      const resDate: any = user
      const userPassword = resDate[0].password
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        userPassword
      )
      if (isPasswordValid) {
        jwt.sign(
          { phone: req.body.phone },
          jwtKey,
          { expiresIn: '72h' },
          (_, token) => {
            return commonRes(res, token, { message: '登录成功' })
          }
        )
      } else {
        return commonRes.error(res, null, '密码错误')
      }
    } else if (e) {
      return commonRes.error(res, null, '登录失败')
    } else {
      return commonRes.error(res, null, '该手机号未注册！')
    }
  } else if (req.body.key == 'captcha') {
    const [errs, captcha] = await silentHandle(
      CaptchaCRUD.findOne,
      {
        phone: req.body.phone,
      },
      { Id: 1, captcha: 1 },
      { sort: '-Id' }
    )
    if (captcha != false) {
      const nowTime: number = Date.parse(new Date().toString())
      // 这里的any 需要修改
      const resDate: any = captcha
      const captchaTime = resDate[0].Id
      if (
        nowTime - captchaTime <= 180000 &&
        resDate[0].captcha == req.body.captcha
      ) {
        return commonRes(res, {}, { message: '登录成功' })
      } else if (
        nowTime - captchaTime > 180000 &&
        resDate[0].captcha == req.body.captcha
      ) {
        return commonRes.error(res, null, '验证码过期')
      } else if (resDate[0].captcha != req.body.captcha) {
        return commonRes.error(res, null, '验证码错误')
      }
    } else if (errs) {
      return commonRes.error(res, null, '登录失败')
    }
  }
}

export async function getCaptchaHandler(req: Request, res: Response) {
  const reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/
  const isPhone: boolean = reg.test(req.body.phone)
  if (!isPhone) {
    return commonRes.error(res, null, '请输入正确的手机号！')
  }

  const [e, user] = await silentHandle(USER_CRUD.find, {
    phone: req.body.phone,
  })
  if (user != false && req.body.type == 'regist') {
    return commonRes.error(res, null, '该手机号已注册！')
  } else if (user != false && req.body.type == 'login') {
    const randomNum: string = Math.random().toFixed(6).slice(-6)
    const data = {
      phone: req.body.phone,
      captcha: randomNum,
      useType: req.body.type,
    }
    const [err, captcha] = await silentHandle(CaptchaCRUD.create, data)
    return err
      ? commonRes.error(res, null, '获取验证码失败！')
      : commonRes(res, captcha, { message: '验证码已发送' })
  } else if (e) {
    return commonRes.error(res, null, '获取验证码失败！')
  } else if (req.body.type == 'login') {
    return commonRes.error(res, null, '用户不存在！')
  }

  const randomNum: string = Math.random().toFixed(6).slice(-6)
  const data = {
    phone: req.body.phone,
    captcha: randomNum,
    useType: req.body.type,
  }
  const [err, captcha] = await silentHandle(CaptchaCRUD.create, data)
  return err
    ? commonRes.error(res, null, '获取验证码失败！')
    : commonRes(res, captcha, { message: '验证码已发送' })
}

export async function loginStutusHandler(req: Request, res: Response) {
  const headers: any = req.headers
  const token = headers['authorization'].split(' ')[1]
  jwt.verify(token, jwtKey, async (err: any, payload: any) => {
    if (err) {
      return commonRes.error(res, null, '未登录')
    } else {
      const [e, user] = await silentHandle(
        USER_CRUD.findOne,
        {
          phone: payload.phone,
        },
        { Id: 1, phone: 1, username: 1 }
      )
      if (user != false) {
        return commonRes(res, user)
      } else {
        return commonRes.error(res, null)
      }
    }
  })
}
