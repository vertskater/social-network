const dbUser = require('../db/user');
const {supabaseAuthWithPassword} = require('../config/supabase');
const supabaseDb = require('../db/supabase/supabaseProfileImg');
const dbImage = require('../db/image');
const {v4: uuid} = require('uuid');
const utils = require('../lib/utils');
require('dotenv').config({path: ".env.development"});

const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  const user = await dbUser.getUserById(req.user.id);
  if(!user) {
    return res.status(404).json({
      success: false,
      msg: "User Profile not found"
    })
  }
  return res.status(200).json({
    success: true,
    msg: 'User Profile found',
    user: user
  })
}

const uploadImage = async (req, res, next) => {
  const file  = req.file;
  try {
    if(!file) {
      return res.status(400).json({success: false, msg: 'no file uploaded'})
    }
    const user = req.user;
    const images = await dbImage.getProfileImages(user.profile.id);
    const profileImageExists = images.find(img => img.imageType === 'PROFILE_PICTURE')

    if(profileImageExists) {
      //Delete Profile picture if exists
      await supabaseDb.deleteProfileImageFromSupabase(
        process.env.SUPABASE_PROFILEIMG_BUCKET,
        profileImageExists.url
      )
    }
    //Upload to Supabase Database
    const filePath = `${uuid()}/${file.originalname}`;
    const profileImage =
      await utils.supabaseProfileImgUpload(filePath, file, user.profile.id, !!profileImageExists)

    return res.status(200).json({
      success: true,
      msg: profileImageExists ? 'Profile image successfully updated' : 'Profile image successfully uploaded',
      img: profileImage})

  }catch (err) {
    console.error(err.message)
    res.status(500).json({success: false, msg: 'sorry, something went wront, try again later'})
  }
}

module.exports = {
  getUserProfile,
  uploadImage
}