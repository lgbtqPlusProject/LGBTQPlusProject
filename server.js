const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const fetch = require('node-fetch');

// Enable CORS for specific domain
const cors = require('cors');
app.use(cors({
    origin: '*',  // Allow the frontend domain
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


// Function to log the Archive.org search query and results to the database
async function logArchiveSearchToDatabase(query, results) {
    const timestamp = new Date().toISOString();  // Get the current timestamp
    const logSql = 'INSERT INTO search_logs (query, search_time, results) VALUES (?, ?, ?)';

    // Here we're saving both the search query and the JSON stringified results
    db.query(logSql, [query, timestamp, JSON.stringify(results)], (err, result) => {
        if (err) {
            console.error('Error logging Archive.org search:', err);
            return;
        }
        console.log('Archive.org search logged to database:', result);
    });
}

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





// Archive.org Search Handling and Logging
async function searchArchive(query) {
    const apiUrl = `https://archive.org/logsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=5&start=0&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const items = data.response.docs;

        // Log the search query to the database
        logSearchToDatabase(query);

        // Here you can handle showing the results, e.g., to the frontend
        return items;  // Returning the results (you can further process this data for the frontend)
    } catch (error) {
        console.error('Error fetching the API:', error);
        return [];  // In case of an error, return an empty array
    }
}


// Define the /search route
app.get('/search', async (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery || searchQuery.trim() === '') {
        return res.status(400).json({ error: 'Search query is missing or empty' });
    }

    try {
        // Perform the Archive.org search and log the query
        const archiveResults = await searchArchive(searchQuery);

        // Respond with the results from Archive.org search
        res.status(200).json(archiveResults);
    } catch (error) {
        res.status(500).json({ error: 'Failed to perform search' });
    }
});




const port = process.env.PORT || 10000; // Default to port 10000 if no environment variable is provided
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
