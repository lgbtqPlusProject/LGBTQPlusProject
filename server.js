const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON requests


// Serve static files (script.js and css/cs01.css)
app.use('/css', express.static(path.join(__dirname, 'css')));  // Serve all CSS files from the css folder

// Serve script.js directly from the root
app.use(express.static(path.join(__dirname, '/')));  // Serve script.js from the root folder

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


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

    // Your database search logic here
        let sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
        let values = [`%${query}%`, `%${query}%`, `%${query}%`];

        db.query(sql, values, (err, results) => {
            if (err) {
                console.error('Database query failed:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No results found' });
            }
            
            res.json(results);
        });
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
