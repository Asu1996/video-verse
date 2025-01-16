const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Video = require('../db/models/video')
const LinkShare = require('../db/models/linkShare')
const fs = require('fs')
const { linkShareExpiry } = require('../config')

const generateLinkController = async (req, res) => {
  const { videoId } = req.body

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required' })
  }

  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(404).json({ error: 'Video not found' })
  }

  const shareToken = uuidv4()
  const expiresAt = new Date(Date.now() + parseInt(linkShareExpiry, 10) * 1000) // from seconds

  try {
    await LinkShare.create(videoId, shareToken, expiresAt)
  } catch (dbErr) {
    return res
      .status(500)
      .json({ error: 'Database error', details: dbErr.message })
  }

  res.json({
    message: 'Link created',
    shareUrl: `${req.protocol}://${req.get('host')}/video/share/${shareToken}`,
  })
}

const accessVideoController = async (req, res) => {
  const { shareToken } = req.params

  const linkShareData = await LinkShare.getFromToken(shareToken)

  if (!linkShareData) {
    return res.status(404).json({ error: 'Invalid link' })
  }

  const expiresAt = new Date(linkShareData.expiresAt)
  if (Date.now() > expiresAt.getTime()) {
    return res.status(403).json({ error: 'Link expired' })
  }

  const video = await Video.findById(linkShareData.videoId)
  if (!video) {
    return res.status(404).json({ error: 'Video not found' })
  }
  const videoPath = path.join(__dirname, '../uploads', video.filename)
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video file not found on server' })
  }

  res.sendFile(videoPath)
}

module.exports = { generateLinkController, accessVideoController }
