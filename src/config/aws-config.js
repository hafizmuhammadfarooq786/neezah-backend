var AWS = require("aws-sdk");
let awsConfig = {
  region: "us-east-2",
  endpoint: "http://dynamodb.us-east-2.amazonaws.com",
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
};
AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports = docClient;
