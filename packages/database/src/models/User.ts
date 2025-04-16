// packages/database/src/models/user.ts
import { prisma } from '../connection.js'
import type { User as PrismaUser, Prisma } from '@prisma/client'

// Extended types
export interface UserWithoutPasswordInterface extends Omit<PrismaUser, 'password'> { }
export interface UserInterface extends PrismaUser { }

// Model class with business logic
export class User implements Partial<UserInterface>{
  password?: string | undefined;
  id?: string | undefined;
  constructor(data: PrismaUser) {
    Object.assign(this, data);
  }

  /* Static methods*/
  static async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return prisma.user.create({ data })
  }

  static async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user ? new User(user) : null;
  }
  static async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? new User(user) : null;
  }
  static async authenticate(username: string, password: string): Promise<Partial<User>| null> {
    const user = await this.findByUsername(username)

    if (!user || user.password !== password) { // Use proper password hashing in real apps
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /* Instance Methods */
  async comparePassword(password: string): Promise<boolean> {
    // In a real application, you would use bcrypt or another library to compare hashed passwords
    return this.password === password
  }
  // More methods as needed...
}