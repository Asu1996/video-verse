const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = require('express').Router()

const { uploadController } = require('../../controllers/uploadController')
const { maxFileSize } = require('../../config')
const { getAllController } = require('../../controllers/getAllController')
const { trimController } = require('../../controllers/trimController')
// const { mergeController } = require('../../controllers/mergeController')
const { mergeController2 } = require('../../controllers/mergeController2')
const {
  generateLinkController,
  accessVideoController,
} = require('../../controllers/linkSharingController')
const { authMiddleware } = require('../../middlewares/auth')

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

router.use(authMiddleware);

router.post('/upload', uploadMiddleware, uploadController)
router.post('/trim', trimController)
router.post('/merge', mergeController2)
router.post('/share', generateLinkController)
router.get('/share/:shareToken', accessVideoController)
router.get('/all', getAllController) // adding a route for personal use to fetch all videos data

module.exports = router
