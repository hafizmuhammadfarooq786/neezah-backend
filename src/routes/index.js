"use strict";

exports.setup = function (app) {
  var userRoutes = require("./UsersRoutes");
  var tableRoutes = require("./TableRoutes");

  app.use("/user/api", userRoutes);
  app.use("/tables", tableRoutes);
};

module.exports = exports;
