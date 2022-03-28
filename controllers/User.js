const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token");
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
    let date = birthdate;

    if (!validator.isEmail(publicEmail))
      return res
        .status(400)
        .json({ message: "This is not correct format for email" });
    // const profileInformation = await User.findOne({ publicEmail })
    //   .lean()
    //   .exec();
    // if (profileInformation) {
    //   return res.status(401).json({
    //     message:
    //       "The email address you entered is already associated with another account!",
    //   });
    // }

    const user = await User.findOne({ email: req.email });
    let avtarPath, coverImagePath;

    if (Object.keys(req.files).length) {
      if (req.files.avatar) {
        avtarPath =
          "http://localhost:8080/Avatar/" + req.files.avatar[0]?.filename;
      }
      if (req.files.coverImage) {
        coverImagePath =
          "http://localhost:8080/Cover-Image/" +
          req.files.coverImage[0]?.filename;
      }
    }

    if (user) {
      user.profileName = profileName;
      user.publicEmail = publicEmail;
      user.description = description;
      user.avatar = avtarPath ? avtarPath : user.avatar;
      user.coverImage = coverImagePath ? coverImagePath : user.coverImage;
      user.birthdate = birthdate;
      user.gender = gender;
      user.country = country;
      user.city = city;
      await user.save();
      return res
        .status(200)
        .json({ message: "ProfileInformation Insert Successfully!" });
    }
    // const newProfileInfo = await new User({
    //   avatar: avtarPath,
    //   coverImage: coverImagePath,
    //   profileName: profileName,
    //   publicEmail: publicEmail,
    //   description: description,
    //   birthdate: birthdate,
    //   gender: gender,
    //   country: country,
    //   city: city,
    // }).save();
    else {
      return res.status(404).send({ message: "User not found!" });
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
      recoveryEmail,
      recoveryPhone,
      questionOne,
      recoveryAnswerOne,
      questionTwo,
      recoveryAnswerTwo,
      questionThree,
      recoveryAnswerThree,
    } = req.body;
    if (!validator.isEmail(accountEmail)) {
      return res
        .status(400)
        .json({ message: "This is not correct format for email" });
    }

    // const validateNumber = validatePhoneNumber.validate(phoneNumber);
    // if (!validateNumber)
    //   return res
    //     .status(400)
    //     .json({ message: "Please Provide Proper Contact-Number!" });
    const user = await User.findOne({ email: req.email });
    if (user) {
      user.fullName = fullName;
      user.accountEmail = accountEmail;
      user.urlUserName = urlUserName;
      user.phoneNumber = phoneNumber;
      user.accountCountry = accountCountry;
      user.language = language;
      user.recoveryEmail = recoveryEmail;
      user.recoveryPhone = recoveryPhone;
      user.securityInfo = [
        {
          questionOne: {
            questionOne: questionOne,
            answerOne: recoveryAnswerOne,
          },
          questionTwo: {
            questionTwo: questionTwo,
            answerTwo: recoveryAnswerTwo,
          },
          questionThree: {
            questionThree: questionThree,
            answerThree: recoveryAnswerThree,
          },
        },
      ];
      // user.securityInfo[0].questionOne = questionOne;
      // user.securityInfo[0].answerOne = recoveryAnswerOne;
      // user.securityInfo[1].questionTwo = questionTwo;
      // user.securityInfo[1].answerTwo = recoveryAnswerTwo;
      // user.securityInfo[2].questionThree = questionThree;
      // user.securityInfo[2].answerThree = recoveryAnswerThree;
      await user.save();
      return res
        .status(200)
        .json({ message: "Account-Information Added Successfully!" });
    }
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, cnewPassword } = req.body;
    const strongPassword = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    if (!strongPassword.test(newPassword.trim())) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
      });
    }
    if (newPassword !== cnewPassword) {
      return res.status(400).json({
        message: "New Password And Repeat Passwrod Must Be Same!",
      });
    }
    const user = await User.findOne({ email: req.email });
    const validPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    console.log("req.email", validPassword);
    const salt = await bcrypt.genSalt(10);

    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
    if (validPassword) {
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({ message: "New Password Update Successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
exports.passwordReset = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).send("User with given email doesn't exist");
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASEURL}/forgotPassword/${user._id}`;

    sendEmail(user.email, user.fullName, link);
    return res
      .status(200)
      .json({ message: "Password Reset link Sent To Your Email Account" });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
exports.setNewPassword = async (req, res) => {
  try {
    const strongPassword = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    if (!strongPassword.test(req.body.newPassword.trim())) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
      });
    }
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "invalid link or expired!" });
    }

    const token = await Token.findOne({
      userId: req.userId,
    });

    if (!token)
      return res.status(404).json({ message: "invalid link or expired!" });
    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = req.body.newPassword;

    await user.save();
    await token.delete();
    res.status(200).json({ message: "Password Update Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const strongPassword = new RegExp(
      "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    if (!strongPassword.test(req.body.newPassword.trim())) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !",
      });
    }
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "invalid link or expired!" });
    }

    const token = await Token.findOne({
      userId: req.userId,
    });

    if (!token)
      return res.status(404).json({ message: "invalid link or expired!" });
    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = req.body.newPassword;

    await user.save();
    await token.delete();
    res.status(200).json({ message: "Password Update Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
exports.resetPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found,Please Enter Registerd Email" });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const link = `http://localhost:3000/updatePassword/${token}`;
    sendEmail(user.email, user.fullName, link);
    return res
      .status(200)
      .json({ message: "ResetPassword Link Sent Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
// --------------------------------------get-requests----------------------
exports.userData = async (req, res) => {
  try {
    const user = User.find({ email: req.email }, (err, users) => {
      if (err) {
        return res.status(404).json({ message: err.message });
      }
      if (users) {
        res.status(200).json({ data: users });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
