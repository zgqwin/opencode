import { BaseModel } from "./base.js"

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  industry?: string
  status: "lead" | "customer" | "inactive"
  source?: string
  assigned_to?: number
  created_by: number
  created_at: string
  updated_at: string
}

export class CustomerModel extends BaseModel {
  async create(customer: Omit<Customer, "id" | "created_at" | "updated_at">): Promise<Customer> {
    if (!customer.name || !customer.email) {
      throw new Error("客户名称和邮箱是必填项")
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      throw new Error("邮箱格式不正确")
    }

    if (customer.status && !["lead", "customer", "inactive"].includes(customer.status)) {
      throw new Error("状态必须是 lead、customer 或 inactive")
    }

    try {
      const sql = `
        INSERT INTO customers (name, email, phone, company, industry, status, source, assigned_to, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const result = await this.run(sql, [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.industry,
        customer.status || "lead",
        customer.source,
        customer.assigned_to,
        customer.created_by,
      ])

      return (await this.getById(result.lastID))!
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        throw new Error("邮箱已被使用")
      }
      throw error
    }
  }

  async getById(id: number): Promise<Customer | null> {
    const sql = `
      SELECT c.*, u.name as assigned_name 
      FROM customers c 
      LEFT JOIN users u ON c.assigned_to = u.id 
      WHERE c.id = ?
    `
    return (await this.get(sql, [id])) as Customer | null
  }

  async getAll(): Promise<Customer[]> {
    const sql = `
      SELECT c.*, u.name as assigned_name 
      FROM customers c 
      LEFT JOIN users u ON c.assigned_to = u.id 
      ORDER BY c.created_at DESC
    `
    return (await this.all(sql)) as Customer[]
  }

  async getByAssignedTo(userId: number): Promise<Customer[]> {
    const sql = `
      SELECT c.*, u.name as assigned_name 
      FROM customers c 
      LEFT JOIN users u ON c.assigned_to = u.id 
      WHERE c.assigned_to = ? 
      ORDER BY c.created_at DESC
    `
    return (await this.all(sql, [userId])) as Customer[]
  }

  async update(
    id: number,
    updates: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>,
  ): Promise<Customer | null> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    if (fields.length === 0) return null

    const sql = `UPDATE customers SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await this.run(sql, [...values, id])

    return await this.getById(id)
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.run("DELETE FROM customers WHERE id = ?", [id])
    return result.changes > 0
  }

  async getStats() {
    const sql = `
      SELECT 
        status,
        COUNT(*) as count
      FROM customers 
      GROUP BY status
    `
    return (await this.all(sql)) as Array<{ status: string; count: number }>
  }

  async search(query: string, filters?: { status?: string; assigned_to?: number }): Promise<Customer[]> {
    let sql = `
      SELECT c.*, u.name as assigned_name 
      FROM customers c 
      LEFT JOIN users u ON c.assigned_to = u.id 
      WHERE (c.name LIKE ? OR c.email LIKE ? OR c.company LIKE ?)
    `
    const params = [`%${query}%`, `%${query}%`, `%${query}%`]

    if (filters?.status) {
      sql += " AND c.status = ?"
      params.push(filters.status)
    }

    if (filters?.assigned_to) {
      sql += " AND c.assigned_to = ?"
      params.push(filters.assigned_to.toString())
    }

    sql += " ORDER BY c.created_at DESC"

    return (await this.all(sql, params)) as Customer[]
  }
}
