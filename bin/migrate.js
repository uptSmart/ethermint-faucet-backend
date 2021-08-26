require("ts-node").register();
const db = require("../database.ts");
db.sequelize.sync();