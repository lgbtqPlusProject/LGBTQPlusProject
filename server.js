const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Enable CORS for specific domain
const cors = require('cors');
app.use(cors({
    origin: 'https://www.lgbtqplusproject.org',  // Allow the frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
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

// Replace with your actual database credentials or environment variables
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



// Define the /search route before app.listen()
app.get('/search', (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: 'Search query is missing or empty' });
    }

    const sql = `SELECT * FROM historicalFigures WHERE name LIKE ? OR contribution LIKE ? OR country LIKE ?`;
    const values = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(200).json([]);  // Return empty array if no results
        }

        res.status(200).json(results);  // Return results as JSON
    });
});




async function logSearch(query) {
    try {
        const response = await fetch('https://lgbtqplusproject.org/logSearch.php', {
            method: 'POST',  // Ensure the correct method is used
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        });

        if (!response.ok) {
            console.error(`Error logging search: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log('Search logged:', data);
    } catch (error) {
        console.error('Error logging search:', error);
    }
}

const port = process.env.PORT || 10000; // Default to port 10000 if no environment variable is provided
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
