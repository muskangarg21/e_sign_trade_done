const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:20,
    host: process.env.dbhost,
    port: process.env.port,  
    user: process.env.dbuser,
    password: process.env.password,
    database: process.env.database
  
  });
exports.pool =pool;  