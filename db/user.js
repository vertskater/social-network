const prisma = require('./database');
const { ImageType } = require('@prisma/client')

const saveNewUser = async (user) => {
  const res = await prisma.user.create({
    data: {
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      username: user.username,
      password: user.password,
    },
  });
  await prisma.profile.create({
    data: {
      userId: res.id
    }
  })
  return res;
};

const getUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};
const getUserById = (id) => {
  return prisma.user.findUnique({
    select: {
      id: true,
      forename: true,
      surname: true,
      email: true,
      role: true,
      username: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        include: {
          images: true
        }
      },
    },
    where: {
      id: id,
    },
  });
};
const getUserByGithubId = (githubId) => {
  return  prisma.user.findUnique({where: { githubId }})
}
const getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
const changeRole = async (newRole, userId) => {
  await prisma.user.update({
    data: {
      role: newRole,
    },
    where: {
      id: userId,
    },
  });
};
const deleteUser = async (userId) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};
const changeEmail = async (email, id) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      email: email,
    },
  });
};
const saveNewUserFromGithub = async(profile) => {
  const name = profile.displayName.split(' ');
  const githubImageUrl = profile.photos?.[0]?.value || null; // Handle missing profile image
  console.log(profile);
  const res = await prisma.user.create({
    data: {
      githubId: profile.id,
      forename: name[0],
      surname: name[1],
      username: profile.username,
      email: profile.emails?.[0]?.value || null,
    }
  })
  const newProfile = await prisma.profile.create({
    data: {
      userId: res.id
    }
  })
  if(githubImageUrl) {
    await prisma.image.create({
      data: {
        url: githubImageUrl,
        imageType: ImageType.PROFILE_PICTURE,
        profileId: newProfile.id
      }
    })
  }
  return res;
}

module.exports = {
  saveNewUser,
  saveNewUserFromGithub,
  getUserByEmail,
  getAllUsers,
  getUserById,
  getUserByGithubId,
  changeRole,
  deleteUser,
  changeEmail,
};
  