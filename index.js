const express = require('express')
const { webAppPort } = require('./config')

const app = express()
app.use(express.json())

app.listen(webAppPort, () => {
  console.log(`Server listening on port ${webAppPort}`)
})

app.use('/', require('./routes'))

module.exports = app
