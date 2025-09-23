const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")

const db = new sqlite3.Database("crm.db")

// 添加测试用户
const users = [
  {
    email: "test@crm.com",
    password: "test123",
    name: "测试用户",
    role: "user",
  },
  {
    email: "admin@crm.com",
    password: "admin123",
    name: "管理员",
    role: "admin",
  },
]

async function addUsers() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    db.run(
      `INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
      [user.email, hashedPassword, user.name, user.role],
      function (err) {
        if (err) {
          console.error("Error adding user:", err)
        } else {
          if (this.changes > 0) {
            console.log(`User ${user.email} added with ID: ${this.lastID}`)
          } else {
            console.log(`User ${user.email} already exists`)
          }
        }
      },
    )
  }
}

addUsers().then(() => {
  setTimeout(() => {
    db.close()
    console.log("Test users added successfully")
  }, 1000)
})
