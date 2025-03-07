const dbUser = require('../db/user');
const {supabaseAuthWithPassword} = require('../config/supabase');
const supabaseDb = require('../db/supabase/supabaseProfileImg');
const dbImage = require('../db/image');
const {v4: uuid} = require('uuid');
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
    if (images.length === 0) {
      //Upload to Supabase Database
      const token = await supabaseAuthWithPassword();
      const filePath = `${uuid()}/${file.originalname}`;
      const upload = await supabaseDb.saveProfileImageToSupabase(
        String(process.env.SUPABASE_PROFILEIMG_BUCKET),
        filePath,
        file,
        token
      )
      //Postgres DB save path to Supabase
      const profileImage = await dbImage.saveNewProfileImage(upload.path, user.profile.id);
      //TODO: change img key to downloaded image
      return res.status(200).json({success: true, msg: "profile image successfulyy uploaded", img: profileImage})
    }
    const isTypeProfile = images.filter(img => img.imageType === 'PROFILE_PICTURE')
    if(images.length > 0 && isTypeProfile.length > 0) {
      //Delete old profile pic from Supabase
      await supabaseDb.deleteProfileImageFromSupabase(process.env.SUPABASE_PROFILEIMG_BUCKET, isTypeProfile[0].url)
      //Upload to Supabase Database
      const token = await supabaseAuthWithPassword();
      const filePath = `${uuid()}/${file.originalname}`;
      const upload = await supabaseDb.saveProfileImageToSupabase(
        String(process.env.SUPABASE_PROFILEIMG_BUCKET),
        filePath,
        file,
        token
      )
      const profileImage= await dbImage.updateNewProfileImage(upload.path, user.profile.id);
      return res.status(200).json({success: true, msg: 'Profile image successfully updated', img: profileImage})
    }
  }catch (err) {
    console.error(err.message)
  }
}

module.exports = {
  getUserProfile,
  uploadImage
}