const nodeMailer = require("nodemailer");
const config = require("../config/config.json");

var http = require("follow-redirects").http;

class System {
  // Generate Password
  generatePassword() {
    var passwordChars = config.PASSWORD_CHARS;
    // generate password length 8 to 12
    var passwordLength = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
    var randomPassword = Array(passwordLength)
      .fill(passwordChars)
      .map(function (password) {
        return password[Math.floor(Math.random() * password.length)];
      })
      .join("");
    return randomPassword;
  }

  // Generate Code
  generateCode() {
    var passwordChars = config.CODE;
    // generate password length 6
    var codeLength = Math.floor(Math.random()) + 5;
    var randomCode = Array(codeLength)
      .fill(passwordChars)
      .map(function (code) {
        return code[Math.floor(Math.random() * code.length)];
      })
      .join("");
    return randomCode;
  }

  getTime() {
    let date_ob = new Date();
    let hours = date_ob.getUTCHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return hours + 5 + ":" + minutes + ":" + seconds;
  }
  // Send Email
  sendEmail(data) {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
      },
    });
    let mailOptions = {
      from: config.EMAIL,
      to: data.email,
      subject: data.subject,
      text: data.text,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error =>", err);
      } else {
        console.log("Email Sent");
      }
    });
  }
}
module.exports = new System();
