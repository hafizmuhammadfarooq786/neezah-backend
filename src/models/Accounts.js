const dynamoose = require("dynamoose");
dynamoose.aws.sdk.config.update({
  region: "us-east-2",
  endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const accountsSchema = require("../schemas/Accounts");
const accountsModel = dynamoose.model("Accounts", accountsSchema);

module.exports = accountsModel;
