const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID
} = require('graphql');

const employeeType = require('./employeeType');
const employee = require('./employee');

module.exports = {
  addEmployee: {
    type: employeeType,
    args: {
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString)
      },
      salary: {
        name: 'salary',
        type: new GraphQLNonNull(GraphQLFloat)
      },
      address: {
        name: 'address',
        type: new GraphQLNonNull(GraphQLString)
      },
      senior: {
        name: 'senior',
        type: new GraphQLNonNull(GraphQLBoolean)
      },
      workExperience: {
        name: 'workExperience',
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve: employee.addEmployee
  },
  updateEmployee: {
    type: employeeType,
    args: {
      _id: {
        type: GraphQLID
      },
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString)
      },
      salary: {
        name: 'salary',
        type: new GraphQLNonNull(GraphQLFloat)
      },
      address: {
        name: 'address',
        type: new GraphQLNonNull(GraphQLString)
      },
      senior: {
        name: 'senior',
        type: new GraphQLNonNull(GraphQLBoolean)
      },
      workExperience: {
        name: 'workExperience',
        type: new GraphQLNonNull(GraphQLInt)
      }
    },
    resolve: employee.updateEmployee
  },
  deleteEmployee: {
    type: employeeType,
    args: {
      _id: {
        type: GraphQLID
      }
    },
    resolve: employee.deleteEmployee
  }
};
