const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const employeeMutations = require('../models/employee/employeeMutations');
const employeeQueries = require('../models/employee/employeeQueries');
const {GraphQLObjectType, GraphQLSchema} = require('graphql');

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Realize Root Query',
  fields: () => ({
    employees: employeeQueries.employees,
    employee: employeeQueries.employee
  })
});

const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Realize Root Mutations',
  fields: () => ({
    addEmployee: employeeMutations.addEmployee,
    updateEmployee: employeeMutations.updateEmployee,
    deleteEmployee: employeeMutations.deleteEmployee
  })
});

const MyGraphQLSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});


const router = new Router();

router.all('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}));


module.exports = router;
