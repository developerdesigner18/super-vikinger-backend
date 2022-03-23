const path = require("path");

const multer = require("multer");

const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      cb(null, "./temp/Avatar/");
    } else if (file.fieldname === "coverImage") {
      cb(null, "./temp/Cover-Image/");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    } else if (file.fieldname === "coverImage") {
      cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
  },
});

const Avatar = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // if (file.fieldname === "avatar") {
    //   if (file.includes(file.originalname)) {
    //     fs.unlinkSync("./temp/Avatar/" + file.originalname);
    //   }
    // }
    // if (file.filename === "coverImage") {
    //   if (file.includes(file.originalname)) {
    //     fs.unlinkSync("./temp/Cover-Image/" + file.originalname);
    //   }
    // }
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Allowed only .png, .jpg, .jpeg and .gif"));
    }
  },
});
var uploadMultiple = Avatar.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

module.exports = uploadMultiple;
