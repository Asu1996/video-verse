const { expect } = require('chai')
const { describe, it } = require('mocha')
const {
  callGetApi,
  callPostApi,
  callPostApiWithSampleVideo,
} = require('../testUtils')

describe('All the routes testing', () => {
  const videoIdsForTesting = []
  it('get all videos', async () => {
    const res = await callGetApi('/video/all')

    expect(res).to.have.status(200)
    // expect(res.body.length).to.be.greaterThan(0)
  }).timeout(-1)

  it('upload new video', async () => {
    const res = await callPostApiWithSampleVideo('/video/upload')
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Upload success')
    videoIdsForTesting.push(res.body.video.id)
  }).timeout(-1)

  it('trim video', async () => {
    const res = await callPostApi('/video/trim', {
      videoId: videoIdsForTesting[0],
      start: 10,
      end: 5,
    })
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Video trimmed')
    videoIdsForTesting.push(res.body.video.id)
  }).timeout(-1)

  it('merge videos', async () => {
    const res = await callPostApi('/video/merge', {
      videoIds: videoIdsForTesting,
    })
    // console.log(res.body)
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Videos merged')
    videoIdsForTesting.push(res.body.video.id)
  }).timeout(-1)

  it('link sharing & access', async () => {
    const res = await callPostApi('/video/share', {
      videoId: videoIdsForTesting[2],
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
