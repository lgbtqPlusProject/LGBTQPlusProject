<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for OPTIONS and POST requests
header("Access-Control-Allow-Origin: https://www.lgbtqplusproject.org");  // Allow only your site
header("Access-Control-Allow-Methods: POST, OPTIONS");  // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow necessary headers
header("Content-Type: application/json");  // Return JSON response

// Handle OPTIONS request (preflight CORS check)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // Return 200 OK for OPTIONS request
    exit();  // Exit to stop further script execution
}

// Handle POST requests (your main logic)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['searchQuery'])) {
        echo json_encode(['success' => false, 'message' => 'Missing search query']);
        exit();
    }

    // Log the search query (you can replace this with actual logic to log into the database)
    $searchQuery = $data['searchQuery'];

    // Example database insertion (replace with your actual database logic)
    // Assuming you have a MySQL connection setup
    $mysqli = new mysqli('localhost', 'username', 'password', 'database_name');
    if ($mysqli->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }

    // Insert query into the database (use prepared statements for security)
    $stmt = $mysqli->prepare("INSERT INTO search_logs (search_query, search_time) VALUES (?, NOW())");
    $stmt->bind_param('s', $searchQuery);
    $stmt->execute();
    $stmt->close();
    $mysqli->close();

    // Send success response
    echo json_encode(['success' => true, 'message' => 'Search logged successfully']);
    exit();
}

http_response_code(405);  // Method Not Allowed for any non-POST and non-OPTIONS requests
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>
