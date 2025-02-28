const prisma = require('./database');

  const saveNewUser = async (user) => {
  return prisma.user.create({
    data: {
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      password: user.password,
    },
  });
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
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: id,
    },
  });
};
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
  
  module.exports = {
  saveNewUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  changeRole,
  deleteUser,
  changeEmail,
};
  