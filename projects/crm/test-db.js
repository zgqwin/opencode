const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("crm.db")

// Check if users table exists and has data
db.all("SELECT * FROM users", (err, rows) => {
  if (err) {
    console.error("Error checking users:", err)
  } else {
    console.log("Current users in database:")
    console.log(rows)

    if (rows.length === 0) {
      console.log("No users found. Adding test users...")

      // Add test users
      const bcrypt = require("bcrypt")
      const hashedPassword1 = bcrypt.hashSync("test123", 10)
      const hashedPassword2 = bcrypt.hashSync("admin123", 10)

      db.run(
        `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        ["test@crm.com", hashedPassword1, "测试用户", "user"],
        function (err) {
          if (err) console.error("Error adding test user:", err)
          else console.log("Test user added with ID:", this.lastID)
        },
      )

      db.run(
        `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        ["admin@crm.com", hashedPassword2, "管理员", "admin"],
        function (err) {
          if (err) console.error("Error adding admin user:", err)
          else console.log("Admin user added with ID:", this.lastID)
        },
      )
    }
  }
})

// Check customers table structure
db.all("PRAGMA table_info(customers)", (err, rows) => {
  if (err) {
    console.error("Error checking customers table:", err)
  } else {
    console.log("\nCustomers table structure:")
    console.log(rows)
  }
})

setTimeout(() => {
  db.close()
  console.log("\nDatabase check completed.")
}, 1000)
