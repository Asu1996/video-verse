const fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
const ffmpeg = require('fluent-ffmpeg')

const { durationLimits } = require('../config')
const Video = require('../db/models/video')

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

const uploadController = (req, res) => {
  const { file } = req
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  ffmpeg.ffprobe(file.path, async (err, metadata) => {
    if (err) {
      fs.unlinkSync(file.path)
      return res.status(400).json({ error: 'Error reading video file' })
    }

    const duration = Math.floor(metadata.format.duration) // in seconds
    if (duration < durationLimits.min || duration > durationLimits.max) {
      fs.unlinkSync(file.path)
      return res
        .status(400)
        .json({ error: 'Video duration out of allowed range (5-25 seconds)' })
    }

    // return res.send(file)
    try {
      const createdVideo = await Video.create(
        file.filename,
        file.originalname,
        duration
      )
      return res.json({ message: 'Upload success', video: createdVideo })
    } catch (dbErr) {
      fs.unlinkSync(file.path)
      return res
        .status(500)
        .json({ error: 'Database error', details: dbErr.message })
    }
  })
}

module.exports = { uploadController }
