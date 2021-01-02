"use strict";
const docClient = require("../config/aws-config");

module.exports = {
  // check email existance using
  isExist: async (userData) => {
    let status;
    const params = {
      TableName: "Accounts",
      KeyConditionExpression: "#mail = :eValue",
      ExpressionAttributeNames: {
        "#mail": "email",
      },
      ExpressionAttributeValues: {
        ":eValue": userData.email,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.query(params, function (err, data) {
          if (err) {
            status = false;
            resolve(status);
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
          } else {
            Number(data.Count) === 1 ? (status = true) : (status = false);
            console.log("Query succeeded.");
            console.log(status);
            resolve(data.Items[0]);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // save account data
  saveAccountResolver: async (accountParams) => {
    let status;
    const tableParams = {
      TableName: "Accounts",
      Item: accountParams,
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.put(tableParams, (err, data) => {
          if (err) {
            status = false;
            resolve(status);
          } else {
            status = true;
            console.log("Query succeeded.");
            console.log(data);
            console.log(status);
            resolve(status);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // save user data
  saveUserResolver: async (userParams) => {
    let status;
    const tableParams = {
      TableName: "Users",
      Item: userParams,
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.put(tableParams, (err, data) => {
          if (err) {
            status = false;
            resolve(status);
          } else {
            status = true;
            console.log("Query succeeded.");
            console.log(data);
            console.log(status);
            resolve(status);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // get all users w.r.t is_delete condition
  getAll: async () => {
    let queryStatus;
    const conditionalParams = {
      TableName: "Users",
      FilterExpression: "#check = :checkStatus",
      ExpressionAttributeNames: {
        "#check": "isDeleted",
      },
      ExpressionAttributeValues: {
        ":checkStatus": false,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, data) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            const returnedResponse = {
              status: queryStatus,
              users: [],
            };
            resolve(returnedResponse);
          } else {
            queryStatus = true;
            console.log("Query succeeded.");
            console.log(data);
            console.log(queryStatus);
            const returnedResponse = {
              status: queryStatus,
              users: data.Items,
            };
            resolve(returnedResponse);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // get user w.rt user_email
  getUserFromUUID: async (user) => {
    let queryStatus;
    const conditionalParams = {
      TableName: "Users",
      FilterExpression: "#check = :checkId",
      ExpressionAttributeNames: {
        "#check": "userId",
      },
      ExpressionAttributeValues: {
        ":checkId": user.userId,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log("Query succeeded.");
            console.log(payload);
            console.log(queryStatus);
            const returnedResponse = {
              status: queryStatus,
              data: payload.Items,
            };
            resolve(returnedResponse);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // get user w.rt user_email
  getUserFromEmail: async (user) => {
    let queryStatus;
    const conditionalParams = {
      TableName: "Users",
      FilterExpression: "#check = :checkEmail",
      ExpressionAttributeNames: {
        "#check": "email",
      },
      ExpressionAttributeValues: {
        ":checkEmail": user.email,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log("Query succeeded.");
            console.log(payload);
            console.log(queryStatus);
            const returnedResponse = {
              status: queryStatus,
              data: payload.Items[0],
            };
            resolve(returnedResponse);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  getUpdatedUserFromEmail: async (email) => {
    let queryStatus;
    const conditionalParams = {
      TableName: "Users",
      FilterExpression: "#check = :checkEmail",
      ExpressionAttributeNames: {
        "#check": "email",
      },
      ExpressionAttributeValues: {
        ":checkEmail": email,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log("Query succeeded.");
            console.log(payload);
            console.log(queryStatus);
            const returnedResponse = {
              status: queryStatus,
              data: payload.Items[0],
            };
            resolve(returnedResponse);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // user email existance in accounts table
  isEmailExists: async (data) => {
    let queryStatus;
    const conditionalParams = {
      TableName: "Accounts",
      FilterExpression: "#check = :checkEmail",
      ExpressionAttributeNames: {
        "#check": "email",
      },
      ExpressionAttributeValues: {
        ":checkEmail": data.email,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            const returnedParams = {
              status: queryStatus,
              user: {},
            };
            resolve(returnedParams);
          } else {
            Number(payload.Count) === 1
              ? (queryStatus = true)
              : (queryStatus = false);
            console.log(payload);
            console.log(queryStatus);
            const returnedParams = {
              status: queryStatus,
              user: payload.Items[0],
            };
            resolve(returnedParams);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // Reset Password
  resetPassword: async (data) => {
    let queryStatus;
    var updatedParams = {
      TableName: "Accounts",
      Key: {
        email: data.email,
      },
      UpdateExpression: "set password=:pass, updatedAt= :update",
      ExpressionAttributeValues: {
        ":pass": data.password,
        ":update": new Date().toString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      return new Promise(function (resolve, reject) {
        docClient.update(updatedParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log(payload);
            console.log(queryStatus);
            resolve(queryStatus);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // update user profile excluded user role, it can be done only hard code from table
  updateProfile: async (data) => {
    let queryStatus;
    var updatedParams = {
      TableName: "Users",
      Key: {
        email: data.email,
      },
      UpdateExpression:
        "set firstName=:fName, lastName=:lName, phone=:mobile, profile=:image, updatedAt=:update",
      ExpressionAttributeValues: {
        ":fName": data.firstName,
        ":lName": data.lastName,
        ":mobile": data.phone,
        ":image": data.profile,
        ":update": new Date().toString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      return new Promise(function (resolve, reject) {
        docClient.update(updatedParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log(payload);
            console.log(queryStatus);
            resolve(queryStatus);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // get user w.rt user_email from defined table name as param
  getUserFromEmailAddress: async (emailAddress, tableName) => {
    let queryStatus;
    const conditionalParams = {
      TableName: tableName,
      FilterExpression: "#check = :checkEmail",
      ExpressionAttributeNames: {
        "#check": "email",
      },
      ExpressionAttributeValues: {
        ":checkEmail": emailAddress,
      },
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.scan(conditionalParams, function (err, payload) {
          if (err) {
            queryStatus = false;
            console.error(
              "Unable to query. Error:",
              JSON.stringify(err, null, 2)
            );
            resolve(queryStatus);
          } else {
            queryStatus = true;
            console.log("Query succeeded.");
            console.log(payload);
            console.log(queryStatus);
            const returnedResponse = {
              status: queryStatus,
              data: payload.Items[0],
            };
            resolve(returnedResponse);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // delete profile with dynamic params
  deleteProfile: async (payload, tableName) => {
    let status;
    var tableParams = {
      TableName: tableName,
      Key: {
        email: payload.email, // partition key
      },
    };
    return new Promise(function (resolve, reject) {
      docClient.delete(tableParams, (err, data) => {
        if (err) {
          status = false;
          resolve(status);
        } else {
          status = true;
          console.log("Delete Account Query succeeded.");
          console.log(status);
          resolve(status);
        }
      });
    });
  },

  // create new profile after deleting previous profile
  createNewProfileAfterDeletePreviousUserProfileAndAccountUsingEmail: async (
    data,
    tableName
  ) => {
    let status;
    var profileParams = {
      TableName: tableName,
      Item: data,
    };
    try {
      return new Promise(function (resolve, reject) {
        docClient.put(profileParams, (err, data) => {
          if (err) {
            status = false;
            resolve(status);
          } else {
            status = true;
            console.log("Query succeeded.");
            console.log(data);
            console.log(status);
            resolve(status);
          }
        });
      });
    } catch (error) {
      return error;
    }
  },
};
