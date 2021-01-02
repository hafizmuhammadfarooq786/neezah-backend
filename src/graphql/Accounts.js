module.exports = `
  type Account {
    accountId: String!
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    account: [Account]
  }

  type Mutation {
    signup(
        accountId: String!,
        email: String!,
        password: String!,
        createdAt: String,
        updatedAt: String): [Account]

    login(
      email: String!,
      password: String!): [Account]
}`;
