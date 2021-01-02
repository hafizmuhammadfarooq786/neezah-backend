"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
var responseService = require("../services/apiResponses");
const constants = require("../constants/Statuses");
const messageConstants = require("../services/messages");
const userResolvers = require("../resolvers/UsersResolver");
const jwt = require("../services/jwt");
const system = require("../services/sendEmail");

class userController {
  // get one data
  async loginUser(data) {
    if (!data.email || !data.password) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    const emailExist = await userResolvers.isExist(data);
    console.log("query data status" + emailExist);
    if (emailExist) {
      var dataObj = {
        email: data.email,
        subject: "Welcome ",
        text: `Hello ${data.email}

        Welcome to Application`,
      };
      const accessToken = await jwt.signAccessToken(data);
      const refreshToken = await jwt.signRefreshToken(data);

      return new Promise(function (resolve, reject) {
        bcrypt.compare(
          data.password,
          emailExist.password,
          function (err, result) {
            if (result == true) {
              system.sendEmail(dataObj);
              const user = {
                email: emailExist.email,
                isDeleted: emailExist.isDeleted,
                updatedAt: emailExist.updatedAt,
                accountId: emailExist.accountId,
                createdAt: emailExist.createdAt,
              };
              return resolve(
                responseService.createResponse(
                  constants.STATUS.SUCCESS,
                  { user, accessToken, refreshToken },
                  messageConstants.LOGIN
                )
              );
            } else {
              return resolve(
                responseService.createResponse(
                  constants.STATUS.ERROR,
                  [],
                  messageConstants.INVALID
                )
              );
            }
          }
        );
      });
    } else {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        [],
        messageConstants.INVALID
      );
    }
  }
  // put one item in given table
  async signUpUser(data) {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        data,
        messageConstants.DATA_MISSING
      );
    }
    const isExist = await userResolvers.isExist(data);
    console.log("is exists" + isExist);
    if (isExist) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        [],
        messageConstants.USER_EXIST
      );
    } else {
      const saltRounds = 10;
      let encryptPassword = new Promise(function (resolve, reject) {
        return bcrypt.hash(data.password, saltRounds, function (err, hash) {
          if (!err) {
            return resolve(hash);
          }
        });
      });
      data.password = await encryptPassword;
      const accountUid = uuidv4();
      var accountParms = {
        accountId: accountUid,
        email: data.email,
        password: data.password,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        isDeleted: false,
      };
      var userParms = {
        accountId: accountUid,
        userId: uuidv4(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        role: data.role,
        profile: "",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        isDeleted: false,
      };

      // Save Account Details
      const account = await userResolvers.saveAccountResolver(accountParms);
      // Save User Details
      if (account) {
        const saveUser = await userResolvers.saveUserResolver(userParms);
        if (saveUser && account) {
          var dataObj = {
            email: data.email,
            subject: "Welcome ",
            text: `Hello ${data.email}

        Welcome to Application`,
          };
          const accessToken = await jwt.signAccessToken(dataObj);
          const refreshToken = await jwt.signRefreshToken(dataObj);
          system.sendEmail(dataObj);
          return responseService.createResponse(
            constants.STATUS.SUCCESS,
            { user: userParms, accessToken, refreshToken },
            messageConstants.SIGNUP
          );
        } else {
          return responseService.createResponse(
            constants.STATUS.ERROR,
            data,
            messageConstants.SIGNUP_ERROR
          );
        }
      }
    }
  }

  // get all users
  async getAllUsers() {
    const allUsers = await userResolvers.getAll();
    if (allUsers.status) {
      return responseService.createResponse(
        constants.STATUS.SUCCESS,
        { users: allUsers.users },
        messageConstants.SUCCESS
      );
    } else {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        { users: [] },
        messageConstants.INVALID
      );
    }
  }

  //  get user by uuid
  async getUserByUUID(data) {
    const user = await userResolvers.getUserFromUUID(data);
    if (user.status) {
      return responseService.createResponse(
        constants.STATUS.SUCCESS,
        { user: user.data },
        messageConstants.SUCCESS
      );
    } else {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        { users: [] },
        messageConstants.INVALID
      );
    }
  }

  // reset password
  async resetPassword(data) {
    if (!data.email || !data.newPassword) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        {},
        messageConstants.DATA_MISSING
      );
    }

    try {
      const emailExist = await userResolvers.isEmailExists(data);
      if (emailExist.status) {
        const saltRounds = 10;
        let encryptPassword = new Promise(function (resolve, reject) {
          return bcrypt.hash(
            data.newPassword,
            saltRounds,
            function (err, hash) {
              if (!err) {
                return resolve(hash);
              }
            }
          );
        });
        data.password = await encryptPassword;
        const resetPasswaord = await userResolvers.resetPassword(data);
        if (resetPasswaord) {
          const userData = await userResolvers.getUserFromEmail(data);
          if (userData.status) {
            var mailObj = {
              email: data.email,
              subject: "Reset Password",
              text: `Hello ${data.email} 
        A request to reset your password has been received. Your new password is pasted below:
    
        Password:${data.newPassword}
        `,
            };
            system.sendEmail(mailObj);
            return responseService.createResponse(
              constants.STATUS.SUCCESS,
              { user: userData.data },
              messageConstants.PASSWORD_CHANGED
            );
          } else {
            console.log("get user failed");
          }
        } else {
          return responseService.createResponse(
            constants.STATUS.ERROR,
            {},
            messageConstants.PASSWORD_NOT_CHANGED
          );
        }
      } else {
        console.log("error");
      }
    } catch (error) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        error,
        messageConstants.EXCEPTION
      );
    }
  }

  async updateUserProfile(data) {
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.phone ||
      !data.role ||
      !data.profile
    ) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        {},
        messageConstants.DATA_MISSING
      );
    }

    try {
      const updatedProfile = await userResolvers.updateProfile(data);
      if (updatedProfile) {
        const userData = await userResolvers.getUserFromEmail(data);
        if (userData.status) {
          var mailObj = {
            email: data.email,
            subject: "UPDATE Profile",
            text: `Hello ${data.email} 
        A request to update your profile has been received and updated. Your can visit your updated profile using below link:
    
        link:Tabdelli a nahi rahi, Tabdelli a gae hai
        `,
          };
          system.sendEmail(mailObj);
          return responseService.createResponse(
            constants.STATUS.SUCCESS,
            { user: userData.data },
            messageConstants.PASSWORD_CHANGED
          );
        } else {
          console.log("get user failed");
        }
      } else {
        return responseService.createResponse(
          constants.STATUS.ERROR,
          {},
          messageConstants.PASSWORD_NOT_CHANGED
        );
      }
    } catch (error) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        error,
        messageConstants.EXCEPTION
      );
    }
  }

  async updateEmail(payload) {
    if (!payload.email || !payload.newEmail) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        {},
        messageConstants.DATA_MISSING
      );
    }

    try {
      // get user account data
      const userAccountData = await userResolvers.getUserFromEmailAddress(
        payload.email,
        "Accounts"
      );
      // get user profile data
      const userProfileData = await userResolvers.getUserFromEmailAddress(
        payload.email,
        "Users"
      );

      console.log("user account" + userAccountData);
      console.log("user profile" + userProfileData);

      if (userAccountData.status && userProfileData.status) {
        const deletedAccountStatus = await userResolvers.deleteProfile(
          userAccountData.data,
          "Accounts"
        );

        const deletedProfileStatus = await userResolvers.deleteProfile(
          userProfileData.data,
          "Users"
        );
        console.log("delete account status" + deletedAccountStatus);
        console.log("delete profile stauts" + deletedProfileStatus);
        if (deletedAccountStatus && deletedProfileStatus) {
          userAccountData.data.email = payload.newEmail;
          userProfileData.data.email = payload.newEmail;
          const createNewAccountWithUpdatedData = await userResolvers.createNewProfileAfterDeletePreviousUserProfileAndAccountUsingEmail(
            userAccountData.data,
            "Accounts"
          );
          const createNewProfileWithUpdatedData = await userResolvers.createNewProfileAfterDeletePreviousUserProfileAndAccountUsingEmail(
            userProfileData.data,
            "Users"
          );

          console.log("create new account" + createNewAccountWithUpdatedData);
          console.log("create new profile" + createNewProfileWithUpdatedData);

          if (
            createNewAccountWithUpdatedData &&
            createNewProfileWithUpdatedData
          ) {
            const userData = await userResolvers.getUpdatedUserFromEmail(
              payload.newEmail
            );
            console.log("fetch user profile" + userProfileData);
            if (userData.status) {
              var mailObj = {
                email: payload.newEmail,
                subject: "UPDATE EMAIL",
                text: `Hello ${payload.newEmail}
        A request to update your profile email has been received and updated. Your can visit your updated profile using below link:
    
        link:Tabdelli a nahi rahi, Tabdelli a gae hai
        `,
              };
              system.sendEmail(mailObj);
              return responseService.createResponse(
                constants.STATUS.SUCCESS,
                { user: userData.data },
                messageConstants.EMAIL_CHANGED
              );
            } else {
              console.log("get user failed");
            }
          } else {
            console.log(
              "create and update previous profile and account with new email address failed"
            );
          }
        } else {
          console.log("delete account or profile failed");
        }
      }
    } catch (error) {
      return responseService.createResponse(
        constants.STATUS.ERROR,
        error,
        messageConstants.EXCEPTION
      );
    }
  }
}

module.exports = new userController();
