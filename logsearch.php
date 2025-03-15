//
//  save_snapshot.php
//  
//
//  Created by Mateo Carnavali on 3/14/25.
//

<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit;
}

// Database connection
$host = 'sv15.byethost15.org'; // Use your iFastNet database host
$dbname = 'lgbtqplu_lgbtqplusproject';
$username = 'lgbtqplu_timo';
$password = 'Rubenom3626#';

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Log search query
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $query = isset($_POST['query']) ? $_POST['query'] : '';

    // Validate input to prevent SQL injection
    $query = $conn->real_escape_string($query);

    // Insert search query into the database
    $sql = "INSERT INTO search_logs (query, search_time) VALUES ('$query', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo "Search logged successfully";
    } else {
        echo "Error logging search: " . $conn->error;
    }
} else {
    echo "Invalid request method";
}

$conn->close();
?>
