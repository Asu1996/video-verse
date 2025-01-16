const chai = require('chai')
const chaiHttp = require('chai-http')
const { authToken } = require('../config')
const fs = require('fs')

chai.use(chaiHttp)

async function callGetApi(apiUrl, queryParams = {}) {
  const app = require('../index')

  const chaiRouter = chai.request(app)
  return chaiRouter.get(apiUrl).set('x-api-key', authToken).query(queryParams)
}

async function callPostApiWithSampleVideo(apiUrl) {
  const app = require('../index')

  const chaiRouter = chai.request(app)

  return chaiRouter
    .post(apiUrl)
    .set('x-api-key', authToken)
    .set('content-type', 'multipart/form-data')
    .attach(
      'videoFile',
      fs.readFileSync(__dirname + '/sample.mp4'),
      'sample.mp4'
    )
}

async function callPostApi(apiUrl, payload) {
  const app = require('../index')

  const chaiRouter = chai.request(app)

  return chaiRouter
    .post(apiUrl)
    .set('x-api-key', authToken)
    .set('content-type', 'application/json')
    .send(payload)
}

module.exports = {
  callGetApi,
  callPostApi,
  callPostApiWithSampleVideo,
}
