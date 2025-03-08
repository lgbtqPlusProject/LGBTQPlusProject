const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON requests

// Replace with your actual database credentials
const db = mysql.createPool({  // Use createPool for multiple connections
  host: 'sv15.byethost15.org',  // Check your hosting provider for the correct hostname
  user: 'lgbtqplu_timo',        // Your database username
  password: 'Rubenom3626#',     // Your database password
  database: 'lgbtqplu_lgbtqplusproject' // Your database name
});

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release(); // Release the connection back to the pool
});

// Search API Endpoint
app.get('/search', (req, res) => {
    let query = req.query.query;
    console.log("Received search query:", query); // Log the incoming query


    if (!query || query.trim() === '') {
        return res.status(400).json({ error: "Search query is missing or empty" });
    }

    // SQL query to search by name, contribution, or country
    let sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
    let values = [`%${query}%`, `%${query}%`, `%${query}%`];

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
            console.log("Query Results: ", results);
            res.json(results);
        }
    });
});

// Start Server
app.listen(80, () => {
    console.log('Server running on port 80');
});
