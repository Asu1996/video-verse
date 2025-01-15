const { authToken } = require("../config")

function authMiddleware(req, res, next) {
  const token = req.header('x-api-key')

  if (!token || token !== authToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next()
}

module.exports = { authMiddleware }
