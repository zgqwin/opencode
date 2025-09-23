import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "crm-secret-key"

export function generateToken(user: any): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })
}
