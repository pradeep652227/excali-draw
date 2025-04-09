// packages/database/src/models/user.ts
import { prisma } from '../connection'
import type { User as PrismaUser, Prisma } from '@prisma/client'

// Extended types
export interface UserWithoutPasswordInterface extends Omit<PrismaUser, 'password'> {}
export interface UserInterface extends PrismaUser {}

// Model class with business logic
export class User {
  // Static methods for database operations
  static async findByUsername(username: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { username }
    })
  }

  static async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return prisma.user.create({ data })
  }

  static async authenticate(username: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.findByUsername(username)
    
    if (!user || user.password !== password) { // Use proper password hashing in real apps
      return null
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  // More methods as needed...
}