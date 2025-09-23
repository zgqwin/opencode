import { BaseModel } from "./base.js"

export interface Opportunity {
  id: number
  title: string
  description?: string
  amount?: number
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
  probability: number
  close_date?: string
  customer_id: number
  assigned_to: number
  created_by: number
  created_at: string
  updated_at: string
}

export class OpportunityModel extends BaseModel {
  async create(opportunity: Omit<Opportunity, "id" | "created_at" | "updated_at">): Promise<Opportunity> {
    const sql = `
      INSERT INTO opportunities (title, description, amount, stage, probability, close_date, customer_id, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const result = await this.run(sql, [
      opportunity.title,
      opportunity.description,
      opportunity.amount,
      opportunity.stage,
      opportunity.probability,
      opportunity.close_date,
      opportunity.customer_id,
      opportunity.assigned_to,
      opportunity.created_by,
    ])

    return (await this.getById(result.lastID))!
  }

  async getById(id: number): Promise<Opportunity | null> {
    const sql = `
      SELECT o.*, c.name as customer_name, u.name as assigned_name
      FROM opportunities o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON o.assigned_to = u.id
      WHERE o.id = ?
    `
    return (await this.get(sql, [id])) as Opportunity | null
  }

  async getAll(): Promise<Opportunity[]> {
    const sql = `
      SELECT o.*, c.name as customer_name, u.name as assigned_name
      FROM opportunities o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON o.assigned_to = u.id
      ORDER BY o.created_at DESC
    `
    return (await this.all(sql)) as Opportunity[]
  }

  async getByAssignedTo(userId: number): Promise<Opportunity[]> {
    const sql = `
      SELECT o.*, c.name as customer_name, u.name as assigned_name
      FROM opportunities o
      JOIN customers c ON o.customer_id = c.id
      JOIN users u ON o.assigned_to = u.id
      WHERE o.assigned_to = ?
      ORDER BY o.created_at DESC
    `
    return (await this.all(sql, [userId])) as Opportunity[]
  }

  async update(
    id: number,
    updates: Partial<Omit<Opportunity, "id" | "created_at" | "updated_at">>,
  ): Promise<Opportunity | null> {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    if (fields.length === 0) return null

    const sql = `UPDATE opportunities SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    await this.run(sql, [...values, id])

    return await this.getById(id)
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.run("DELETE FROM opportunities WHERE id = ?", [id])
    return result.changes > 0
  }

  async getPipelineStats() {
    const sql = `
      SELECT 
        stage,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM opportunities 
      WHERE stage NOT IN ('closed_won', 'closed_lost')
      GROUP BY stage
    `
    return (await this.all(sql)) as Array<{ stage: string; count: number; total_amount: number }>
  }
}
