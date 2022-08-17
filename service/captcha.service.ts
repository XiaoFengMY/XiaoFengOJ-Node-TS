// user.service.ts
// mongodb操作

import { BaseCrudProvider } from '../utils/crudProvider'
import CaptchaModel, { CaptchaDocument } from '../models/captcha.model'

const CaptchaCRUD = BaseCrudProvider<
  CaptchaDocument,
  Omit<CaptchaDocument, 'createdAt'>
>(CaptchaModel)

export default CaptchaCRUD
