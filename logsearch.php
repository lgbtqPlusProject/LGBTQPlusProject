<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit;
}

// Database connection
$host = 'sv15.byethost15.org'; // Your iFastNet database host
$dbname = 'lgbtqplu_lgbtqplusproject';
$username = 'lgbtqplu_timo';
$password = 'Rubenom3626#';

$conn = new mysqli($host, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the query and results from the POST body (assuming results are passed as JSON)
    $data = json_decode(file_get_contents('php://input'), true);
    error_log(print_r($data, true));  // Log the data to the error log
    
    // Check if query and results exist
    if (!isset($data['query']) || !isset($data['results'])) {
        echo json_encode(['error' => 'Query or results are missing']);
        exit;
    }

    $query = $data['query'];
    $results = json_encode($data['results']);  // Store results as JSON string
    $timestamp = date('Y-m-d H:i:s'); // Get current timestamp

    // Prepare and execute the insert query
    $stmt = $conn->prepare("INSERT INTO search_logs (query, search_time, results) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $query, $timestamp, $results);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Search logged successfully']);
    } else {
        echo json_encode(['error' => 'Failed to log search: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
