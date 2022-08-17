// user.model.ts

import mongoose from 'mongoose'

// 模板接口
export interface CaptchaDocument extends mongoose.Document {
  phone: string
  captcha: string
  Id: Date
}

// 模板校验规则
const captchaSchema = new mongoose.Schema({
  Id: { type: Number, default: Date.now },
  phone: { type: String, required: true },
  captcha: { type: String, required: true },
})

// 唯一
captchaSchema.index({ Id: 1 }, { unique: true })

// 创建模板 执行之后会自动在mongodb中创建相应的模板
const CaptchaModel = mongoose.model<CaptchaDocument>('Captcha', captchaSchema)

export default CaptchaModel
