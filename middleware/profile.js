const dbUser = require('../db/user');

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

const uploadImage = (req, res, next) => {
  console.log(req.user);
}

module.exports = {
  getUserProfile,
  uploadImage
}