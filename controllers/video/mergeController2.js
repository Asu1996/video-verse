const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const fs = require('fs')
const path = require('path')

ffmpeg.setFfmpegPath(ffmpegPath)
const Video = require('../../db/models/video')

const mergeController2 = async (req, res) => {
  const { videoIds } = req.body

  if (!Array.isArray(videoIds) || videoIds.length < 2) {
    return res
      .status(400)
      .json({ error: 'Provide at least two video IDs to merge' })
  }

  try {
    let mergedVideo = ffmpeg()
    const videoPaths = []
    for (let id of videoIds) {
      const video = await Video.findById(id)
      if (!video) {
        return res.status(404).json({ error: `Video with ID ${id} not found` })
      }
      videoPaths.push(path.join(__dirname, '../../uploads', video.filename))

      mergedVideo = mergedVideo.addInput(
        path.join(__dirname, '../../uploads', video.filename)
      )
    }

    const outputFilename = `${Date.now()}-merged.mp4`
    const outputPath = path.join(__dirname, '../../uploads', outputFilename)

    mergedVideo
      .complexFilter([
        {
          filter: 'concat',
          options: {
            n: 2,
            v: 1,
            a: 1,
          },
          inputs: ['0:v:0', '0:a:0', '1:v:0', '1:a:0'],
          outputs: ['outv', 'outa'],
        },
      ])
      .outputOptions(['-map [outv]', '-map [outa]', '-c:v libx264', '-c:a aac'])
      .output(outputPath)
      .on('end', () => {
        ffmpeg.ffprobe(outputPath, async (err, metadata) => {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Error reading merged video file' })
          }
          const finalDuration = Math.floor(metadata.format.duration)
          const mergedVideo = await Video.create(
            outputFilename,
            'merged-video.mp4',
            finalDuration
          )

          res.status(200).json({ message: 'Videos merged', video: mergedVideo })
        })
      })
      .on('error', (err) => {
        console.error(err)
        return res.status(500).json({ error: 'Failed to merge videos' })
      })
      .run()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = { mergeController2 }