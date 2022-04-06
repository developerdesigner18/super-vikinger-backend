const nodemailer = require("nodemailer");
require("dotenv").config();
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const sendEmail = async (email, name, link) => {
  try {
    // console.log(typeof );
    const transporter = nodemailer.createTransport({
      // host: process.env.HOST,
      service: "gmail",
      // port: 587,
      // secure: true ,
      auth: {
        user: "jenishchopda.dds@gmail.com",
        pass: "Vamp@25120",
      },
    });
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views"),
    };
    transporter.use("compile", hbs(handlebarOptions));
    var mailDetails = {
      from: process.env.USER, // sender address
      to: email, // list of receivers
      subject: "Welcome!",
      template: "email", // the name of the template file i.e email.handlebars
      context: {
        name: name, // replace {{name}} with Adebola
        link: link, // replace {{company}} with My Company
      },
    };

    transporter.sendMail(mailDetails, function (error, result) {
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log(result);
        return result;
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = { sendEmail };
