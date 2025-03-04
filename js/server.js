const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = 3000;

const app = express();
app.use(cors());  // Allow frontend to access backend
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",  // Change if your MySQL username is different
  password: "",  // Change to your MySQL password
  database: "lgbtqplusproject"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

app.get("/search", (req, res) => {
  const query = req.query.q;
  const sql = `SELECT * FROM history WHERE name LIKE ? OR description LIKE ?`;
  
  db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(PORT, () => console.log("Server running on port ${PORT}"));
