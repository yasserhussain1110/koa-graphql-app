require('../config');
const mongoose = require('../db/mongoose');

const {insertEmployeesInDB, insertAdminsInDB} = require('./seedInfo');

(async () => {
  await Promise.all([insertEmployeesInDB(), insertAdminsInDB()]);
  mongoose.connection.close();
})();
