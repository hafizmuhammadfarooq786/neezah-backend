var express = require("express");
var router = express.Router();
var createTablesController = require("../controllers/CreateTablesController");

// create users table
router.post("/createUsersTable", function (req, res) {
  res.json(createTablesController.createUsersTable());
});

// create accounts table
router.post("/createAccountsTable", function (req, res) {
  res.json(createTablesController.createAccountsTable());
});

module.exports = router;
