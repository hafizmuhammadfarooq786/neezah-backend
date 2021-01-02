"use strict";
var dynamoose = require("dynamoose");
const usersSchema = require("../schemas/Users");
const accountsSchema = require("../schemas/Accounts");

class CreateTablesController {
  // Create Users Table using users schema
  async createUsersTable() {
    const Users = dynamoose.model("Users", usersSchema);
    console.log(await Users.table.create.request());
  }

  async createAccountsTable() {
    const Accounts = dynamoose.model("Accounts", accountsSchema);
    console.log(await Accounts.table.create.request());
  }
}

module.exports = new CreateTablesController();
