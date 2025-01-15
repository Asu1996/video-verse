// const { expect } = require('chai');
const { describe, it } = require('mocha')
const Video = require('../db/models/video')

describe.skip('Testing Db functionality', () => {
  it('create video', async () => {
    const createdVideo = await Video.create('test.mp4', 'test.mp4', 100)
    console.log('added video: ', createdVideo)

    const allVideos = await Video.listAll()
    console.log('all videos: ', allVideos)
  }).timeout(-1)
})
