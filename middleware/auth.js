const Admin = require('../models/admin/admin');

const auth = async (ctx, next) => {
  const token = ctx.headers['x-auth'];
  const admin = await Admin.findByToken(token);
  if (!admin) {
    ctx.status = 401;
    return;
  }

  ctx.request.admin = admin;
  ctx.request.token = token;
  await next();
};

module.exports = auth;
