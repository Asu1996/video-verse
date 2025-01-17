const express = require('express')
const { webAppPort } = require('./config')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(express.json())

const uploadDir = path.join(__dirname, './uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

app.listen(webAppPort, () => {
  console.log(`Server listening on port ${webAppPort}`)
})

app.use('/', require('./routes'))

module.exports = app
