const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "zephyr.proxy.rlwy.net",
  user: "root",
  password: "SzKFGNnVnBtAyaDyHpjujDiKPPFgcneE",
  database: "railway",
  port: 19777
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;