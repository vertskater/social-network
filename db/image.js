const prisma = require('./database');
const { ImageType } = require('@prisma/client')

const saveNewProfileImage = async (imgPath, profileId) => {
  return prisma.image.create({
    data: {
      url: imgPath,
      profileId: profileId,
      imageType: ImageType.PROFILE_PICTURE
    }
  })
}
const updateNewProfileImage = async (imgPath, profileId) => {
  return prisma.image.update({
    data: {
      url: imgPath,
    },
    where: {
      profileId: profileId,
      imageType: ImageType.PROFILE_PICTURE
    }
  })
}

const getProfileImages = (profileId) => {
  return prisma.image.findMany({
    where: {
      profileId: profileId
    }
  })
}

module.exports = {
  saveNewProfileImage,
  updateNewProfileImage,
  getProfileImages
}