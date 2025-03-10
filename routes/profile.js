const router = require('express').Router();
const {isUser} = require('../middleware/authRoles');
const passport = require('passport');
const profileController = require('../middleware/profile.js');
const multer = require('multer');
//Set Multer to memory storage and filesize to 5 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

//GET Routes
router.get('/:username', passport.authenticate('jwt', {session: false}), isUser, profileController.getUserProfile);

router.post('/:username', passport.authenticate('jwt', {session: false}), isUser, profileController.saveUserProfile)

//POST Routes
router.post(
  '/upload/image',
  passport.authenticate('jwt', {session: false}),
  isUser,
  upload.single('profileImage'),
  profileController.uploadImage
);


module.exports = router;