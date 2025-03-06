const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rubenom3626#', // ⚠️ Do not share passwords publicly!
    database: 'lgbtqplusproject'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Search API Endpoint
app.get('/search', (req, res) => {
    let searchQuery = req.query.query;
    if (!searchQuery) return res.json([]);

    let sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ?`;
    let values = [`%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        console.log("Query Results:", results);  // Check what is returned from the database
        res.json(results); //Send results to front end 
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
