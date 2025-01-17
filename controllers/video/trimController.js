const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const Video = require('../../db/models/video')

const trimController = async (req, res) => {
  const { videoId, start = 0, end = 0 } = req.body

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required' })
  }

  try {
    const video = await Video.findById(videoId)
    if (!video) {
      return res.status(404).json({ error: 'Video not found' })
    }

    const inputPath = path.join(__dirname, '../../uploads', video.filename)
    const outputFilename = `${Date.now()}-trimmed-${video.filename}`
    const outputPath = path.join(__dirname, '../../uploads', outputFilename)

    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(video.duration - start - end)
      .videoCodec('libx264')
      .audioCodec('aac')
      .output(outputPath)
      .on('end', async () => {
        // creating new row instead of updating the existing row
        const newDuration = video.duration - start - end
        const trimmedVideo = await Video.create(
          outputFilename,
          `trimmed-${video.originalName}`,
          newDuration
        )

        return res.json({ message: 'Video trimmed', video: trimmedVideo })
      })
      .on('error', (error) => {
        console.error(error)
        return res.status(500).json({ error: 'Failed to trim video' })
      })
      .run()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { trimController }
