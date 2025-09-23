import bcrypt from "bcrypt"
import { BaseModel } from "./base.js"

export interface User {
  id: number
  email: string
  password: string
  name: string
  role: "admin" | "user"
  created_at: string
  updated_at: string
}

export class UserModel extends BaseModel {
  async create(user: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    if (!user.email || !user.password || !user.name) {
      throw new Error("邮箱、密码和姓名是必填项")
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error("邮箱格式不正确")
    }

    if (user.password.length < 6) {
      throw new Error("密码长度至少6位")
    }

    if (user.role && !["admin", "user"].includes(user.role)) {
      throw new Error("角色必须是 admin 或 user")
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    try {
      const sql = `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`
      const result = await this.run(sql, [user.email, hashedPassword, user.name, user.role || "user"])

      return (await this.getById(result.lastID))!
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        throw new Error("邮箱已被注册")
      }
      throw error
    }
  }

  async getById(id: number): Promise<User | null> {
    return (await this.get("SELECT * FROM users WHERE id = ?", [id])) as User | null
  }

  async getByEmail(email: string): Promise<User | null> {
    return (await this.get("SELECT * FROM users WHERE email = ?", [email])) as User | null
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getByEmail(email)
    if (!user) return false
    return await bcrypt.compare(password, user.password)
  }

  async getAll(): Promise<User[]> {
    return (await this.all("SELECT id, email, name, role, created_at, updated_at FROM users")) as User[]
  }

  async update(id: number, updates: Partial<Omit<User, "id" | "created_at" | "updated_at">>): Promise<User | null> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    if (fields.length === 0) return null

    const sql = `UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await this.run(sql, [...values, id])

    return await this.getById(id)
  }
}
