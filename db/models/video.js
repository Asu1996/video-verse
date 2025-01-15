const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../database.sqlite')
const db = new sqlite3.Database(dbPath)

class Video {
  /**
   * @param {string} filename
   * @param {string} originalName
   * @param {number} duration
   * @returns {Promise<{id: number, filename: string, originalName: string, duration: number}>}
   */
  static create(filename, originalName, duration) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO videos (filename, originalName, duration)
        VALUES (?, ?, ?)
      `
      db.run(query, [filename, originalName, duration], function (err) {
        if (err) return reject(err)
        resolve({ id: this.lastID, filename, originalName, duration })
      })
    })
  }

  static listAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM videos`
      db.all(query, (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  }
}

module.exports = Video
