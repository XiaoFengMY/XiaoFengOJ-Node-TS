// user.model.ts

import mongoose from 'mongoose'

// 模板接口
export interface UserDocument extends mongoose.Document {
  phone: string
  password: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  Id: Date
}

// 模板校验规则
const userSchema = new mongoose.Schema(
  {
    Id: {type: Number, default: new Date()},
    phone: { type: String, required: true },
    account: { type: String, required: false },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

// 唯一
userSchema.index({ phone: 1, deletedAt: 1 }, { unique: true })

// 创建模板 执行之后会自动在mongodb中创建相应的模板
const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel
