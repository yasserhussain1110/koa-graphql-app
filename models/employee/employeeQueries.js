const {
  GraphQLList,
  GraphQLID
} = require('graphql');

const employeeType = require('./employeeType');
const employee = require('./employee');

module.exports = {
  employees: {
    type: new GraphQLList(employeeType),
    resolve: employee.getListOfEmployees
  },
  employee: {
    type: employeeType,
    args: {
      _id: {
        type: GraphQLID
      }
    },
    resolve: employee.getUserById
  }
};
