import { cpSync, existsSync } from "fs"
import { join } from "path"

const srcDir = process.cwd()
const distDir = join(srcDir, "dist")
const publicDir = join(srcDir, "public")

console.log("Building CRM project...")

// 检查 dist 目录是否存在
if (!existsSync(distDir)) {
  console.error("dist directory does not exist. Run tsc first.")
  process.exit(1)
}

// 复制 public 目录
if (existsSync(publicDir)) {
  console.log("Copying public directory...")
  cpSync(publicDir, join(distDir, "public"), { recursive: true })
  console.log("Public directory copied successfully")
} else {
  console.log("Public directory not found, skipping...")
}

console.log("Build completed successfully!")
