const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../db/database.sqlite')
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS link_shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      videoId INTEGER NOT NULL,
      shareToken TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY(videoId) REFERENCES videos(id)
    )
  `)
})

db.close()
