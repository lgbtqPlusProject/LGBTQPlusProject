const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rubenom3626#',
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
    const searchQuery = req.query.query;

    // Log the search query to make sure it's being received correctly
    console.log("Search Query: ", searchQuery);

    if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: "Search query is missing or empty" });
    }

    // SQL query to search by name, contribution, or country
    let sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
    let values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    // Execute the query
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database query failed:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        // Check if the result set is empty
        if (results.length === 0) {
            res.status(404).json({ message: 'No results found' });
        } else {
            // Log the results to verify the data
            console.log("Query Results: ", results);
            // Send the results back to the frontend
            res.json(results);
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
