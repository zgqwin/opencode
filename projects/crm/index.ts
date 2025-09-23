import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import jwt from "jsonwebtoken"
import { UserModel } from "./src/models/user.js"
import { CustomerModel } from "./src/models/customer.js"
import { OpportunityModel } from "./src/models/opportunity.js"
import { ActivityModel } from "./src/models/activity.js"
import { generateToken } from "./src/middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface AuthRequest extends Request {
  user?: any
}

const app = express()
const PORT = process.env.PORT || 3100

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const userModel = new UserModel()
const customerModel = new CustomerModel()
const opportunityModel = new OpportunityModel()
const activityModel = new ActivityModel()

// Authentication routes
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const isValid = await userModel.verifyPassword(email, password)

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = await userModel.getByEmail(email)
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(400).json({ error: "Invalid request" })
  }
})

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name, role = "user" } = req.body

    const user = await userModel.create({ email, password, name, role })
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" })
  }
})

// Middleware for protected routes
const checkAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "crm-secret-key") as any
    req.user = user
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid token" })
  }
}

// Customers API
app.get("/api/customers", checkAuth, async (req: AuthRequest, res: Response) => {
  const { search, status, assigned_to } = req.query

  if (search) {
    const customers = await customerModel.search(search as string, {
      status: (status as string) || undefined,
      assigned_to: assigned_to ? parseInt(assigned_to as string) : undefined,
    })
    return res.json(customers)
  }

  const customers = await customerModel.getAll()
  res.json(customers)
})

app.post("/api/customers", checkAuth, async (req: AuthRequest, res: Response) => {
  const customer = await customerModel.create({ ...req.body, created_by: req.user!.id })
  res.status(201).json(customer)
})

app.get("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const customer = await customerModel.getById(parseInt(req.params.id))
  if (!customer) return res.status(404).json({ error: "Customer not found" })
  res.json(customer)
})

app.put("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const customer = await customerModel.update(parseInt(req.params.id), req.body)
  if (!customer) return res.status(404).json({ error: "Customer not found" })
  res.json(customer)
})

app.delete("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const deleted = await customerModel.delete(parseInt(req.params.id))
  if (!deleted) return res.status(404).json({ error: "Customer not found" })
  res.json({ message: "Customer deleted" })
})

// Opportunities API
app.get("/api/opportunities", checkAuth, async (req: AuthRequest, res: Response) => {
  const opportunities = await opportunityModel.getAll()
  res.json(opportunities)
})

app.post("/api/opportunities", checkAuth, async (req: AuthRequest, res: Response) => {
  const opportunity = await opportunityModel.create({ ...req.body, created_by: req.user!.id })
  res.status(201).json(opportunity)
})

app.get("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const opportunity = await opportunityModel.getById(parseInt(req.params.id))
  if (!opportunity) return res.status(404).json({ error: "Opportunity not found" })
  res.json(opportunity)
})

app.put("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const opportunity = await opportunityModel.update(parseInt(req.params.id), req.body)
  if (!opportunity) return res.status(404).json({ error: "Opportunity not found" })
  res.json(opportunity)
})

app.delete("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const deleted = await opportunityModel.delete(parseInt(req.params.id))
  if (!deleted) return res.status(404).json({ error: "Opportunity not found" })
  res.json({ message: "Opportunity deleted" })
})

// Activities API
app.get("/api/activities", checkAuth, async (req: AuthRequest, res: Response) => {
  const activities = await activityModel.getAll()
  res.json(activities)
})

app.post("/api/activities", checkAuth, async (req: AuthRequest, res: Response) => {
  const activity = await activityModel.create({ ...req.body, created_by: req.user!.id })
  res.status(201).json(activity)
})

app.get("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const activity = await activityModel.getById(parseInt(req.params.id))
  if (!activity) return res.status(404).json({ error: "Activity not found" })
  res.json(activity)
})

app.put("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const activity = await activityModel.update(parseInt(req.params.id), req.body)
  if (!activity) return res.status(404).json({ error: "Activity not found" })
  res.json(activity)
})

app.delete("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  const deleted = await activityModel.delete(parseInt(req.params.id))
  if (!deleted) return res.status(404).json({ error: "Activity not found" })
  res.json({ message: "Activity deleted" })
})

// Dashboard stats
app.get("/api/dashboard/stats", checkAuth, async (req: AuthRequest, res: Response) => {
  const customerStats = await customerModel.getStats()
  const pipelineStats = await opportunityModel.getPipelineStats()
  const upcomingActivities = await activityModel.getUpcoming()

  res.json({
    customers: customerStats,
    pipeline: pipelineStats,
    upcoming_activities: upcomingActivities,
  })
})

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Professional CRM API Server",
    version: "1.0.0",
    endpoints: {
      auth: {
        login: "POST /auth/login",
        register: "POST /auth/register",
      },
      customers: {
        list: "GET /api/customers",
        create: "POST /api/customers",
        get: "GET /api/customers/:id",
        update: "PUT /api/customers/:id",
        delete: "DELETE /api/customers/:id",
      },
      opportunities: {
        list: "GET /api/opportunities",
        create: "POST /api/opportunities",
        get: "GET /api/opportunities/:id",
        update: "PUT /api/opportunities/:id",
        delete: "DELETE /api/opportunities/:id",
      },
      activities: {
        list: "GET /api/activities",
        create: "POST /api/activities",
        get: "GET /api/activities/:id",
        update: "PUT /api/activities/:id",
        delete: "DELETE /api/activities/:id",
      },
      dashboard: {
        stats: "GET /api/dashboard/stats",
      },
    },
  })
})

app.listen(PORT, () => {
  console.log(`Professional CRM server running on http://localhost:${PORT}`)
})
