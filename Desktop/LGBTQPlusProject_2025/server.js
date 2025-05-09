const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const fetch = require('node-fetch');
const app = express();

// Enable CORS for specific domains only
const allowedOrigins = ['https://www.lgbtqplusproject.org', 'https://www.lgbtqplusproject.org'];

// CORS middleware
app.use(cors({
    origin: '*',  // Allow only this origin
    methods: ['POST', 'OPTIONS'],  // Allow POST and OPTIONS methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers
}));

app.use(express.static(path.join(__dirname, 'public')));

// Your routes for handling POST requests (including the search logging route)
app.post('/logSearch', (req, res) => {
    const searchQuery = req.body.searchQuery;

    // Example: Log search query to the database (or do any action)
    console.log('Logging search:', searchQuery);

    // Respond with success message
    res.json({ success: true, message: 'Search logged successfully' });
});


// Preflight OPTIONS requests handling
app.options('*', cors());  // This handles OPTIONS requests globally

// Parse JSON bodies
app.use(express.json());

// Serve static files like script.js and CSS
app.use(express.static(path.join(__dirname, '/')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure this path points to your index.html
});

// Database connection pool
const db = mysql.createPool({
    host: 'sv15.byethost15.org',
    user: 'lgbtqplu_timo',
    password: 'Rubenom3626#',
    database: 'lgbtqplu_lgbtqplusproject'
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release();
});

// Routes
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

// Handle POST request to log search query
app.post('/logSearch', (req, res) => {
    const searchQuery = req.body.query; // Get query from the request body
    const results = req.body.results;   // Get results from the request body

    if (!searchQuery || !results) {
        return res.status(400).json({ error: 'Query or results are missing' });
    }

    const timestamp = new Date().toISOString();
    const logSql = 'INSERT INTO search_logs (query, search_time, results) VALUES (?, ?, ?)';

    db.query(logSql, [searchQuery, timestamp, JSON.stringify(results)], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to log search: ' + err.message });
        }

        res.status(200).json({ message: 'Search logged successfully' });
    });
});

// Set up server to listen
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
