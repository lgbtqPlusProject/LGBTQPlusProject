const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Enable CORS and allow only the frontend domain
app.use(cors());

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
  const query = req.query.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: "Query parameter missing or empty" });
  }

  // Your database search logic (e.g., querying MySQL)

  const sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
  const values = [`%${query}%`, `%${query}%`, `%${query}%`];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results); // Return the results to the frontend
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
