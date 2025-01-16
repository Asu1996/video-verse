const { expect } = require('chai')
const { describe, it } = require('mocha')
const {
  callGetApi,
  callPostApi,
  callPostApiWithSampleVideo,
} = require('../testUtils')

describe.skip('All the routes testing', () => {
  it.skip('get all videos', async () => {
    const res = await callGetApi('/video/all')

    expect(res).to.have.status(200)
    expect(res.body.length).to.be.greaterThan(0)
  }).timeout(-1)

  it.skip('upload new video', async () => {
    const res = await callPostApiWithSampleVideo('/video/upload')
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Upload success')

    // videoId: 27 & 26 // to be used in next test
  }).timeout(-1)

  it.skip('trim video', async () => {
    const res = await callPostApi('/video/trim', {
      videoId: 27,
      start: 10,
      end: 5,
    })
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Video trimmed')
  }).timeout(-1)

  it.skip('merge videos', async () => {
    const res = await callPostApi('/video/merge', {
      videoIds: [27, 26],
    })
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Videos merged')
  }).timeout(-1)

  it.skip('link sharing & access', async () => {
    const res = await callPostApi('/video/share', {
      videoId: 19,
    })
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Link created')

    const res2 = await callGetApi(
      `/video${res.body.shareUrl.split('/video')[1]}`
    )
    expect(res2).to.have.status(200)
  }).timeout(-1)
})
