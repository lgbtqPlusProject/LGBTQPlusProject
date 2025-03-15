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
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure the request has a 'query' parameter
    if (isset($_POST['query'])) {
        $query = $_POST['query'];

        // Proceed with logging the search query
        $timestamp = date('Y-m-d H:i:s');  // Current timestamp
        $connection = new mysqli('your_host', 'your_user', 'your_password', 'your_database');

        if ($connection->connect_error) {
            die("Connection failed: " . $connection->connect_error);
        }

        $stmt = $connection->prepare("INSERT INTO search_logs (query, search_time) VALUES (?, ?)");
        $stmt->bind_param("ss", $query, $timestamp);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Search logged successfully']);
        } else {
            echo json_encode(['error' => 'Failed to log search']);
        }

        $stmt->close();
        $connection->close();
    } else {
        echo json_encode(['error' => 'Missing search query']);
    }
}

$conn->close();
?>
