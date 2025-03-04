const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lgbtqplusproject"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database");
});

// Search API // Define GET route
app.get("/search", (req, res) => {
    const searchTerm = req.query.q;
    // SQL query to search the historicalFigures table
    const sql = "SELECT * FROM historicalFigures WHERE name LIKE ? OR name LIKE ?";
    
    db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        console.log("Search Results:", results); // log the results here
        res.json(results); // send the results as JSON
    });
});
// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
