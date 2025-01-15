const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, '../database.sqlite')
const db = new sqlite3.Database(dbPath)

/** @typedef {{ id: number, filename: string, originalName: string, duration: number, createdAt: string }} VideoSchema */

class LinkShare {
  /**
   * @param {number} videoId
   * @param {string} shareToken
   * @param {string} expiresAt
   */
  static create(videoId, shareToken, expiresAt) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO link_shares (videoId, shareToken, expiresAt) VALUES (?, ?, ?)
      `
      db.run(
        query,
        [videoId, shareToken, expiresAt.toISOString()],
        function (err) {
          if (err) return reject(err)
          resolve()
        }
      )
    })
  }

  static getFromToken(shareToken) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM link_shares WHERE shareToken = ?`
      db.get(query, [shareToken], (err, row) => {
        if (err) return reject(err)
        resolve(row)
      })
    })
  }
}

module.exports = LinkShare
