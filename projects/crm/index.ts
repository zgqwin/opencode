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
  try {
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
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取客户列表失败" })
  }
})

app.post("/api/customers", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerModel.create({
      ...req.body,
      created_by: req.user?.id || 1,
    })
    res.status(201).json(customer)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "创建客户失败" })
  }
})

app.get("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerModel.getById(parseInt(req.params.id))
    if (!customer) return res.status(404).json({ error: "Customer not found" })
    res.json(customer)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取客户信息失败" })
  }
})

app.put("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerModel.update(parseInt(req.params.id), req.body)
    if (!customer) return res.status(404).json({ error: "Customer not found" })
    res.json(customer)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "更新客户失败" })
  }
})

app.delete("/api/customers/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await customerModel.delete(parseInt(req.params.id))
    if (!deleted) return res.status(404).json({ error: "Customer not found" })
    res.json({ message: "Customer deleted" })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "删除客户失败" })
  }
})

// Opportunities API
app.get("/api/opportunities", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const opportunities = await opportunityModel.getAll()
    res.json(opportunities)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取销售机会列表失败" })
  }
})

app.post("/api/opportunities", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityModel.create({ ...req.body, created_by: req.user!.id })
    res.status(201).json(opportunity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "创建销售机会失败" })
  }
})

app.get("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityModel.getById(parseInt(req.params.id))
    if (!opportunity) return res.status(404).json({ error: "Opportunity not found" })
    res.json(opportunity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取销售机会信息失败" })
  }
})

app.put("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const opportunity = await opportunityModel.update(parseInt(req.params.id), req.body)
    if (!opportunity) return res.status(404).json({ error: "Opportunity not found" })
    res.json(opportunity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "更新销售机会失败" })
  }
})

app.delete("/api/opportunities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await opportunityModel.delete(parseInt(req.params.id))
    if (!deleted) return res.status(404).json({ error: "Opportunity not found" })
    res.json({ message: "Opportunity deleted" })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "删除销售机会失败" })
  }
})

// Activities API
app.get("/api/activities", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const activities = await activityModel.getAll()
    res.json(activities)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取活动列表失败" })
  }
})

app.post("/api/activities", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await activityModel.create({ ...req.body, created_by: req.user!.id })
    res.status(201).json(activity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "创建活动失败" })
  }
})

app.get("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await activityModel.getById(parseInt(req.params.id))
    if (!activity) return res.status(404).json({ error: "Activity not found" })
    res.json(activity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取活动信息失败" })
  }
})

app.put("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const activity = await activityModel.update(parseInt(req.params.id), req.body)
    if (!activity) return res.status(404).json({ error: "Activity not found" })
    res.json(activity)
  } catch (error: any) {
    res.status(400).json({ error: error.message || "更新活动失败" })
  }
})

app.delete("/api/activities/:id", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await activityModel.delete(parseInt(req.params.id))
    if (!deleted) return res.status(404).json({ error: "Activity not found" })
    res.json({ message: "Activity deleted" })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "删除活动失败" })
  }
})

// Dashboard stats
app.get("/api/dashboard/stats", checkAuth, async (req: AuthRequest, res: Response) => {
  try {
    const customerStats = await customerModel.getStats()
    const pipelineStats = await opportunityModel.getPipelineStats()
    const upcomingActivities = await activityModel.getUpcoming()

    res.json({
      customers: customerStats,
      pipeline: pipelineStats,
      upcoming_activities: upcomingActivities,
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || "获取仪表板数据失败" })
  }
})

// 全局错误处理中间件
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("未捕获的错误:", error)
  res.status(500).json({ error: "服务器内部错误" })
})

// 404 处理
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "接口不存在" })
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
