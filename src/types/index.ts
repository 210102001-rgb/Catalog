import { User } from '@prisma/client'

export type SafeUser = Omit<User, 'password_hash' | 'remember_token'>

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}