const { mergeTypes } = require("merge-graphql-schemas");
const Users = require("./Users");
const Accounts = require("./Accounts");
const types = [Users, Accounts];

module.exports = mergeTypes(types, { all: true });
