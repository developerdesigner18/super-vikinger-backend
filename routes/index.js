const User = require("../controllers/User");
const uploadMultiple = require("../middlewares/uploadImage");
const { verifyToken } = require("../middlewares/authJwt");
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send("Lau - API");
  });
  app.use("/user/Register", User.register);
  app.use("/user/Login", User.login);
  app.use("/user/profileInfo", uploadMultiple, verifyToken, User.profileInfo);
  app.use("/user/accountInfo", verifyToken, User.accountInfo);
};
