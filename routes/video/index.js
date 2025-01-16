const router = require('express').Router()

const { uploadController } = require('../../controllers/uploadController')
const { getAllController } = require('../../controllers/getAllController')
const { trimController } = require('../../controllers/trimController')
// const { mergeController } = require('../../controllers/mergeController')
const { mergeController2 } = require('../../controllers/mergeController2')
const {
  generateLinkController,
  accessVideoController,
} = require('../../controllers/linkSharingController')
const { authMiddleware } = require('../../middlewares/authMiddleware')
const { uploadMiddleware } = require('../../middlewares/uploadMiddleware')

router.use(authMiddleware);

router.post('/upload', uploadMiddleware, uploadController)
router.post('/trim', trimController)
router.post('/merge', mergeController2) // using the new controller. the older one had some issues with merging trimmed videos.
router.post('/share', generateLinkController)
router.get('/share/:shareToken', accessVideoController)
router.get('/all', getAllController) // adding a route for personal use to fetch all videos data

module.exports = router
