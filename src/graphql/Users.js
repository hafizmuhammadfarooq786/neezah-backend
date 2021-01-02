module.exports = `
  type User {
    userId: String!
    accountId: String!
    firstName: String!
    lastName: String!
    phone: String
    role: String
    profile: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    user: [User]
  }

  type Mutation {
    createUser(
      userId: String!,
      accountId: String!,
      firstName: String!,
      lastName: String!,
      phone: String,
      role: String,
      profile: String,
      createdAt: String,
      updatedAt: String): [User]
}`;
