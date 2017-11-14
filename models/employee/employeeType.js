const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean
} = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Employee',
  description: 'Employee object',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    salary: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    address: {
      type: new GraphQLNonNull(GraphQLString)
    },
    senior: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    workExperience: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
});
