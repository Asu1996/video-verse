const Video = require('../../db/models/video')

const getAllController = async (req, res) => {
  const allVideos = await Video.listAll()
  return res.json(allVideos)
}

module.exports = { getAllController }
