"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const constants = require("../constants/Statuses");
const messageConstants = require("../services/messages");
const responseService = require("../services/apiResponses");
var admin_subject;
var user_subject;
module.exports = {
  /* 
    Access Token
  */
  signAccessToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = config.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
        issuer: "neezah.com",
        audience: user.email,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.USER_ERROR
          );
        }
        return resolve(token);
      });
    });
  },
  /* 
    Refresh TOken
  */
  signRefreshToken: (user) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = config.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
        issuer: "neezah.com",
        audience: user.email,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.USER_ERROR
          );
        }
        return resolve(token);
      });
    });
  },
  adminSignToken(user) {
    admin_subject = user.email;
    var i = "node_backend"; // Issuer
    var s = admin_subject; // Subject
    var a = "node_backend"; // Audience
    // SIGNING OPTIONS
    var signOptions = {
      issuer: i,
      subject: s,
      audience: a,
      algorithm: "RS256",
    };
    return new Promise(function (resolve, reject) {
      var token = jwt.sign(
        { user },
        constants.privateKEY,
        signOptions,
        (err, token) => {
          if (err) {
            return resolve(
              responseService.createResponse(
                constants.CODE.UNAUTHORIZED,
                { auth: false },
                messageConstants.USER_ERROR
              )
            );
          } else {
            return resolve(token);
          }
        }
      );
    });
  },
  verifyToken(req, res, next) {
    const bearerHeader = req.headers["x-access-token"];
    // Check if bearer is undefined
    try {
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const decode_token = jwt.decode(token, { complete: true });
        var i = "node_backend"; // Issuer
        var s = decode_token.payload.user.email; // Subject
        var a = "node_backend"; // Audience
        var verifyOptions = {
          issuer: i,
          subject: s,
          audience: a,
          algorithm: ["RS256"],
        };
        jwt.verify(
          token,
          constants.publicKEY,
          verifyOptions,
          function (err, decoded) {
            if (err) {
              return res.json(
                responseService.createResponse(
                  constants.CODE.UNAUTHORIZED,
                  { auth: false },
                  messageConstants.AUTHENTICATION_ERROR
                )
              );
            } else {
              console.log("decoded", decoded);
            }
          }
        );
        return next();
      } else {
        return res.json(
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.AUTHENTICATION
          )
        );
      }
    } catch (error) {
      return res.json(
        responseService.createResponse(
          constants.STATUS.ERROR,
          error,
          messageConstants.EXCEPTION
        )
      );
    }
  },
  // USER TOKEN AND VERIFICATION
  userSignToken(user) {
    user_subject = user.phone;
    var i = "node_backend"; // Issuer
    var s = user_subject; // Subject
    var a = "node_backend"; // Audience
    // SIGNING OPTIONS
    var signOptions = {
      issuer: i,
      subject: s,
      audience: a,
      algorithm: "RS256",
    };
    return new Promise(function (resolve, reject) {
      var token = jwt.sign(
        { user },
        constants.privateKEY,
        signOptions,
        (err, token) => {
          if (err) {
            return resolve(
              responseService.createResponse(
                constants.CODE.UNAUTHORIZED,
                { auth: false },
                messageConstants.USER_ERROR
              )
            );
          } else {
            return resolve(token);
          }
        }
      );
    });
  },
  userVerifyToken(req, res, next) {
    const bearerHeader = req.headers["x-access-token"];
    // Check if bearer is undefined
    try {
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const decode_token = jwt.decode(token, { complete: true });
        var i = "node_backend"; // Issuer
        var s = decode_token.payload.user.email; // Subject
        var a = "node_backend"; // Audience
        var verifyOptions = {
          issuer: i,
          subject: s,
          audience: a,
          algorithm: ["RS256"],
        };
        jwt.verify(
          token,
          constants.publicKEY,
          verifyOptions,
          function (err, decoded) {
            if (err) {
              return res.json(
                responseService.createResponse(
                  constants.CODE.UNAUTHORIZED,
                  { auth: false },
                  messageConstants.AUTHENTICATION_ERROR
                )
              );
            } else {
              console.log("decoded", decoded);
            }
          }
        );
        return next();
      } else {
        return res.json(
          responseService.createResponse(
            constants.CODE.UNAUTHORIZED,
            { auth: false },
            messageConstants.AUTHENTICATION
          )
        );
      }
    } catch (error) {
      return res.json(
        responseService.createResponse(
          constants.STATUS.ERROR,
          error,
          messageConstants.EXCEPTION
        )
      );
    }
  },
};
