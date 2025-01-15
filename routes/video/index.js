const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = require('express').Router()

const { uploadController } = require('../../controllers/uploadController')
const { maxFileSize } = require('../../config')

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: maxFileSize },
}).single('videoFile')

router.post('/upload', uploadMiddleware, uploadController)

module.exports = router
