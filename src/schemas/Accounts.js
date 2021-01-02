const dynamoose = require("dynamoose");
const accountsSchema = new dynamoose.Schema(
  {
    accountId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: "Email is required",
    },
    password: {
      type: String,
      required: "Password is reqired",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    saveUnknown: true,
  }
);

module.exports = accountsSchema;
