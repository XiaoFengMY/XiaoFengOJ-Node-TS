// user.service.ts
// mongodb操作

import { BaseCrudProvider } from '../utils/crudProvider'
import UserModel, { UserDocument } from '../models/user.model'

const USER_CRUD = BaseCrudProvider<UserDocument, Omit<UserDocument, 'createdAt'>>(
  UserModel
)

export default USER_CRUD
