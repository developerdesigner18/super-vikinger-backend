const nodemailer = require("nodemailer");
const sendEmail = async (email, subject, text) => {
  try {
    let ob = {
      user: process.env.USER,
      pass: process.env.PASS,
    };
    // console.log(typeof );
    const transporter = nodemailer.createTransport({
      // host: process.env.HOST,
      service: "gmail",
      // port: 587,
      // secure: true ,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully!");
  } catch (error) {
    console.log(error, "email not found : ");
  }
};

module.exports = sendEmail;
