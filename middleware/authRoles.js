
  const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role === "ADMIN") {
      return next();
    }
    res.status(401).json({
      success: false,
      msg: "you are not authorized to perform this action",
    });
  };

  const isUser = (req, res, next) => {
    const user = req.user;
    if (user.role === "USER" || user.role === "ADMIN") {
      return next();
    }
    res.status(401).json({
      success: false,
      msg: "you are not authorized to perform this action",
    });
  };

  module.exports = {
    isAdmin,
    isUser,
  };
  