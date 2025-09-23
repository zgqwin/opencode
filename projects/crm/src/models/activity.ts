import { BaseModel } from "./base.js"

export interface Activity {
  id: number
  type: "call" | "email" | "meeting" | "task"
  subject: string
  description?: string
  due_date?: string
  completed: boolean
  customer_id?: number
  opportunity_id?: number
  assigned_to: number
  created_by: number
  created_at: string
  updated_at: string
}

export class ActivityModel extends BaseModel {
  async create(activity: Omit<Activity, "id" | "created_at" | "updated_at">): Promise<Activity> {
    const sql = `
      INSERT INTO activities (type, subject, description, due_date, completed, customer_id, opportunity_id, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await this.run(sql, [
      activity.type,
      activity.subject,
      activity.description,
      activity.due_date,
      activity.completed,
      activity.customer_id,
      activity.opportunity_id,
      activity.assigned_to,
      activity.created_by,
    ])

    return (await this.getById(result.lastID))!
  }

  async getById(id: number): Promise<Activity | null> {
    const sql = `
      SELECT a.*, u.name as assigned_name,
             c.name as customer_name, o.title as opportunity_title
      FROM activities a
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.id = ?
    `
    return (await this.get(sql, [id])) as Activity | null
  }

  async getAll(): Promise<Activity[]> {
    const sql = `
      SELECT a.*, u.name as assigned_name,
             c.name as customer_name, o.title as opportunity_title
      FROM activities a
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN opportunities o ON a.opportunity_id = o.id
      ORDER BY a.due_date ASC, a.created_at DESC
    `
    return (await this.all(sql)) as Activity[]
  }

  async getByAssignedTo(userId: number): Promise<Activity[]> {
    const sql = `
      SELECT a.*, u.name as assigned_name,
             c.name as customer_name, o.title as opportunity_title
      FROM activities a
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.assigned_to = ?
      ORDER BY a.due_date ASC, a.created_at DESC
    `
    return (await this.all(sql, [userId])) as Activity[]
  }

  async getUpcoming(): Promise<Activity[]> {
    const sql = `
      SELECT a.*, u.name as assigned_name,
             c.name as customer_name, o.title as opportunity_title
      FROM activities a
      LEFT JOIN users u ON a.assigned_to = u.id
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN opportunities o ON a.opportunity_id = o.id
      WHERE a.due_date >= date('now') AND a.completed = FALSE
      ORDER BY a.due_date ASC
    `
    return (await this.all(sql)) as Activity[]
  }

  async update(
    id: number,
    updates: Partial<Omit<Activity, "id" | "created_at" | "updated_at">>,
  ): Promise<Activity | null> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    if (fields.length === 0) return null

    const sql = `UPDATE activities SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await this.run(sql, [...values, id])

    return await this.getById(id)
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.run("DELETE FROM activities WHERE id = ?", [id])
    return result.changes > 0
  }
}
