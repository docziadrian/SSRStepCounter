var mysql = require("mysql");
require("dotenv").config();

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME,
});

pool.getConnection((err) => {
  if (err) {
    console.error("Adatbázis kapcsolat hiba: ", err);
  } else {
    console.log("Sikeres adatbázis kapcsolat.");
  }
});

module.exports = pool;
