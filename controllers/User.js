const User = require("../models/user");
const validator = require("validator");
const validatePhoneNumber = require("validate-phone-number-node-js");
const bcrypt = require("bcrypt");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
exports.profileInfo = async (req, res) => {
  try {
    const {
      avatar,
      coverImage,
      profileName,
      publicEmail,
      description,
      birthdate,
      gender,
      country,
      city,
    } = req.body;
    if (!validator.isEmail(publicEmail))
      return res
        .status(400)
        .json({ message: "This is not correct format for email" });
    const profileInformation = await User.findOne({ publicEmail })
      .lean()
      .exec();
    if (profileInformation) {
      return res.status(401).json({
        message:
          "The email address you entered is already associated with another account!",
      });
    }
    console.log(req.files, "--------------------------");
    const avtarPath =
      "http://localhost:8080/Avatar/" + req.files.avatar[0].filename;
    const coverImagePath =
      "http://localhost:8080/Cover-Image/" + req.files.coverImage[0].filename;

    const newProfileInfo = await new User({
      avatar: avtarPath,
      coverImage: coverImagePath,
      profileName: profileName,
      publicEmail: publicEmail,
      description: description,
      birthdate: birthdate,
      gender: gender,
      country: country,
      city: city,
    }).save();
    if (newProfileInfo) {
      return res
        .status(200)
        .json({ message: "ProfileInformation Insert Successfully!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.accountInfo = async (req, res) => {
  console.log("req.body----------------", req.userId);
  try {
    const {
      fullName,
      accountEmail,
      urlUserName,
      phoneNumber,
      accountCountry,
      language,
    } = req.body;
    if (!validator.isEmail(accountEmail)) {
      return res
        .status(400)
        .json({ message: "This is not correct format for email" });
    }
    const accountInformation = await User.findOne({
      accountEmail: accountEmail,
    })
      .lean()
      .exec();
    if (accountInformation) {
      return res.status(400).json({
        message:
          "The email you entered is already associated with another account",
      });
    }
    const validateNumber = validatePhoneNumber.validate(phoneNumber);
    if (!validateNumber)
      return res
        .status(400)
        .json({ message: "Please Provide Proper Contact-Number!" });
    const newAccountInformation = await new User({
      fullName: fullName,
      accountEmail: accountEmail,
      urlUserName: urlUserName,
      phoneNumber: phoneNumber,
      accountCountry: accountCountry,
      language: language,
    }).save();
    if (newAccountInformation) {
      return res
        .status(200)
        .json({ message: "Account-Information Added Successfully!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.register = async (req, res) => {
  try {
    console.log("ReqBody------------------", req.body);
    const { email, userName, password, repeatPassword } = req.body;
    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ message: "This is not correct format for the email!" });
    const strongPassword = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );

    if (!strongPassword.test(password.trim())) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
      });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({
        message: "Password And Repeat Passwrod Must Be Same!",
      });
    }

    const user = await User.findOne({ email }).lean().exec();
    if (user) {
      return res.status(401).json({
        message:
          "The email address you entered is already associated with another account!",
      });
    }

    const salt = await bcrypt.genSalt(10);

    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newUser = await new User({ ...req.body }).save();
    if (newUser) {
      return res.status(200).json({ message: "Successfully registered user" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.login = async (req, res) => {
  try {
    const user =
      (await User.findOne({
        email: req.body.email,
      })) || (await User.findOne({ userName: req.body.email }));
    // res.send(user);
    if (user) {
      const validPasswrod = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPasswrod) {
        var token = jwt.sign(
          { id: user.id, email: user.email },
          config.secret,
          {
            expiresIn: "28d", // 24 hours
          }
        );
        res.status(200).json({ message: "Successfully login!", token: token });
      } else {
        res
          .status(400)
          .json({ message: "Password you enter is doesn't match!" });
      }
      console.log("token--------------->", token);
    } else {
      res.status(401).json({ message: "User Not Found!" });
    }
  } catch (error) {}
};
