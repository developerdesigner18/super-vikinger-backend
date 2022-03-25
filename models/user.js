const mongooes = require("mongoose");
const User = new mongooes.Schema(
  {
    email: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    profileName: {
      type: String,
    },
    publicEmail: {
      type: String,
    },
    description: {
      type: String,
    },
    birthdate: {
      type: Date,

      trim: true,
    },
    power: {
      type: Number,

      default: 56,
    },
    defense: {
      type: Number,

      default: 60,
    },
    gender: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    fullName: {
      type: String,
    },
    urlUserName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    language: {
      type: String,
    },
    recoveryEmail: {
      type: String,
    },
    recoveryPhone: {
      type: String,
    },
    securityInfo: [
      {
        questionOne: {
          questionOne: String,
          answerOne: String,
        },
        questionTwo: {
          questionTwo: String,
          answerTwo: String,
        },
        questionThree: {
          questionThree: String,
          answerThree: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongooes.model("User", User);
