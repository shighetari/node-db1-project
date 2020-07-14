const knex = require("knex");

const knexfile = require("../knexfile.js");

// change to "production" and update knexfile.js to use postgres.
const database =  "production"; //process.env DATABASE_URL||

module.exports = knex(knexfile[database]);
