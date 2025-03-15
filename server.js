const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();


// Enable CORS for specific domain
app.use(cors({
    origin: 'https://www.lgbtqplusproject.org', // Your frontend domain
    methods: ['GET', 'POST'], // Allow specific methods (GET/POST)
}));

// Allow JSON requests
app.use(express.json());

// Serve static files like script.js and css
app.use(express.static(path.join(__dirname, '/')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure this path points to your index.html
});

// Replace with your actual database credentials
const db = mysql.createPool({
    host: 'sv15.byethost15.org',
    user: 'lgbtqplu_timo',
    password: 'Rubenom3626#',
    database: 'lgbtqplu_lgbtqplusproject'
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

// Search route
app.get('/search', (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: 'Search query is missing or empty' });
    }

    // Perform your database query here
    // Example:
    const sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
    const values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No results found' });
        }

        res.json(results);
    });
});

      // Log the search query into the search_logs table
      const timestamp = new Date().toISOString();
      const logSql = 'INSERT INTO search_logs (query, search_time) VALUES (?, ?)';
      db.query(logSql, [searchQuery, timestamp], (err) => {
          if (err) {
              console.error('Failed to log search query:', err);
          }
      });

      res.json(results); // Send results back to the client
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
