//
//  save_snapshot.php
//  
//
//  Created by Mateo Carnavali on 3/14/25.
//

<?php
// logSearch.php

host: 'sv15.byethost15.org',  // Check your hosting provider for the correct hostname
user: 'lgbtqplu_timo',        // Your database username
password: 'Rubenom3626#',     // Your database password
database: 'lgbtqplu_lgbtqplusproject' // Your database name

// Connect to the MySQL database
$conn = new mysqli($host, $username, $password, $database);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the search query from the request
$query = isset($_POST['query']) ? $conn->real_escape_string($_POST['query']) : '';

// Insert the search query into the database
if ($query !== '') {
    $stmt = $conn->prepare("INSERT INTO search_logs (query, search_time) VALUES (?, NOW())");
    $stmt->bind_param("s", $query);
    $stmt->execute();
    $stmt->close();
}

$conn->close();
?>
