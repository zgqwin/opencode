import sqlite3 from "sqlite3"
import { promisify } from "util"

const db = new sqlite3.Database("crm.db")

db.run("PRAGMA journal_mode = WAL")
db.run("PRAGMA foreign_keys = ON")

const dbRun = promisify(db.run.bind(db))
const dbGet = promisify(db.get.bind(db))
const dbAll = promisify(db.all.bind(db))

export { db, dbRun, dbGet, dbAll }
