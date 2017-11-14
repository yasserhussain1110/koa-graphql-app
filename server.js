require('./config');
require('./db/mongoose');

const auth = require('./middleware/auth');
const Koa = require('koa');
const bodyParser = require('koa-body');

const app = new Koa();

app.use(bodyParser());
app.use(auth);

const rest = require('./routes/rest');
const graphql = require('./routes/graphql');

app.use(rest.routes());
app.use(graphql.routes()).use(graphql.allowedMethods());

const server = app.listen(process.env.PORT);

module.exports = server;


