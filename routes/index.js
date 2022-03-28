const User = require("../controllers/User");
const uploadMultiple = require("../middlewares/uploadImage");
const { verifyToken } = require("../middlewares/authJwt");
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send("Lau - API");
  });
  app.get("/user", verifyToken, User.userData);
  app.post("/user/Register", User.register);
  app.post("/user/Login", User.login);
  app.post("/user/profileInfo", uploadMultiple, verifyToken, User.profileInfo);
  app.post("/user/accountInfo", verifyToken, User.accountInfo);
  app.post("/user/changePassword", verifyToken, User.changePassword);
  app.post("/user/forgotPassword", verifyToken, User.passwordReset);
  app.post("/user/resetPassword/:userId", verifyToken, User.setNewPassword);
  app.post("/user/resetPasswordEmail", User.resetPasswordEmail);
  app.post("/user/updatePassword", User.updatePassword);
};
