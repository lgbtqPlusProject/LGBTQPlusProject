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
    // Get the query and results from the POST body (assuming results are passed as JSON)
    $data = json_decode(file_get_contents('php://input'), true);
    $query = $data['query'];
    $results = json_encode($data['results']);  // Store results as JSON string

    if (empty($query)) {
        echo json_encode(['error' => 'Query is missing']);
        exit;
    }

    $timestamp = date('Y-m-d H:i:s'); // Get current timestamp
    $connection = new mysqli('your_host', 'your_user', 'your_password', 'your_database');
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    $stmt = $connection->prepare("INSERT INTO search_log (query, search_time, results) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $query, $timestamp, $results);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Search logged successfully']);
    } else {
        echo json_encode(['error' => 'Failed to log search']);
    }

    $stmt->close();
    $connection->close();
}
?>
