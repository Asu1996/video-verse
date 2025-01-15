const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../db/database.sqlite')
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      originalName TEXT,
      duration INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

db.close()
