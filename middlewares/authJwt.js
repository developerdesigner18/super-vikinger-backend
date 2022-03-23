const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require("../models/user");

verifyToken = (req, res, next) => {
  let token = JSON.parse(req.headers["x-access-token"]);

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  });
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
