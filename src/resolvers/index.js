const { mergeResolvers } = require("merge-graphql-schemas");

const usersResolver = require("./UsersResolver");

const resolvers = [usersResolver];

module.exports = mergeResolvers(resolvers);
