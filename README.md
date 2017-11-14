# Koa, GraphQL App

# Checklist

- [X] Create a simple model on mongoose
- [X] Create a REST CRUD (create, read, update, delete) for the model created using koajs
- [X] it should be open sourced on your github repo

# Extras
- [X] Create a GraphQL Type for the model created, and expose it in a GraphQL endpoint
- [X] Add tests using [Jest](https://jest-everywhere.now.sh)
- [X] Add authentication
- [ ] Add docker support


# Prerequisites
  * Node >= 7.7.3
  * MongoDB >= 3.2.12

# Getting Started
  * Clone this repo - `git clone git@github.com:yasserhussain1110/koa-graphql-app.git`
  * cd into cloned repo
  * Copy sample .env file - `cp sample.env .env`
  * Fill in .env values
  * Install npm dependencies - `npm i`
  * Start mongodb server
  * Seed the database - `npm run seed`
  * Start server - `npm run start`
  * (Optional) Test application - `npm run test`

# Details

 ## Models
 
  * **[Employee](/models/employee/employee.js)** - This model created using Mongoose is manipulated 
    using the Project's Rest API and GraphQL.
   
  * **[Admin](/models/admin/admin.js)** - Admin model is used for
    [authenticating](/middleware/auth.js) requests.
  
  
 ## Routes
 
  * **[REST](/routes/rest.js)** - Requests can be sent to update/fetch data via ordinary REST API.
  * **[GraphQL](/routes/graphql.js)** - Requests can be sent to update/fetch data via GraphQL.
  
 
 ## Tests
  This project used Facebook's [Jest](https://jest-everywhere.now.sh) Framework for testing
  purposes.  
  [Tests](/test) cover both REST API and GraphQL endpoints.
