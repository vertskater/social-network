const router = require('express').Router();
const {isUser} = require('../middleware/authRoles');
const passport = require('passport');
const profileController = require('../middleware/profile.js');
//GET Routes
router.get('/:username', passport.authenticate('jwt', {session: false}), isUser, profileController.getUserProfile);

//POST Routes
router.post('/upload/image', passport.authenticate('jwt', {session: false}), isUser, profileController.uploadImage);

module.exports = router;