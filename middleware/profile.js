const dbUser = require('../db/user');
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
    //TODO: exclude password
    user: {
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      role: user.role,
      username: user.username,
      profile: {
        bio: user.profile.bio,
        images: user.profile.images.filter(image => image.imageType === "PROFILE_PICTURE").map(img => img.url)
      }
    }
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
const saveUserProfile = async (req, res, next) => {
  try {
    const {forename, surname, bio} = req.body;

    const updateData = {}
    if(forename) updateData.forename = forename;
    if(surname) updateData.surname = surname;

    const updateProfile = {}
    if(bio) updateProfile.bio = bio;

    if(Object.keys(updateData).length === 0 && Object.keys(updateProfile).length === 0) {
      return res.status(400).json({success: false, msg: "No Data to update user"})
    }
    const updatedUser =
      await dbUser.changeUserData(updateData, updateProfile, req.user.id);

    return res.status(200).json({success: true, msg: "user successfully updated", user: updatedUser})
  }catch (err) {
    console.error(err.message);
    return res.status(500).json({success: false, msg: "user could not be updated"})
  }

}

module.exports = {
  getUserProfile,
  saveUserProfile,
  uploadImage
}