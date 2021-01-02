const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");
const typeDefs = require("./src/graphql/index");
const rootValue = require("./src/resolvers/index");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var bodyParser = require("body-parser");
const schema = buildSchema(typeDefs);
var cors = require("cors");
var port = process.env.PORT || 8080;
const logger = require("morgan");
const routes = require("./src/routes/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(require("express-promise")());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json(err.message);
});

routes.setup(app);
var http = require("http").Server(app);
http.listen(port);

console.log(`Server running on port: ${port}`);
module.exports = app;
