// user.schema.ts
// 接口参数校验 主要使用zod，具体使用可查看文档

import { object, string, TypeOf } from 'zod'

// 创建接口
export const createUserSchema = object({
  body: object({
    phone: string({ required_error: '缺少用户手机号' }).min(1),
    captcha: string({ required_error: '缺少验证码' }).min(1),
    password: string({ required_error: '缺少用户密码' }).min(
      6,
      '密码太短 - 至少6个字符'
    ),
    passwordConfirmation: string({ required_error: '缺少确认密码' }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: '两次密码不匹配',
    path: ['passwordConfirmation'],
  }),
})

export const getCaptchaSchema = object({
  body: object({
    phone: string({ required_error: '缺少用户手机号' }).min(1),
  }),
})

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>
