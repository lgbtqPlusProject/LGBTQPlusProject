<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers for preflight and POST requests
header("Access-Control-Allow-Origin: https://www.lgbtqplusproject.org");  // Allow specific origin
header("Access-Control-Allow-Methods: POST, OPTIONS");  // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow necessary headers
header("Content-Type: application/json");  // Return JSON response

// Handle preflight (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // Send success response for OPTIONS preflight request
    exit();  // Exit to prevent further execution
}

// Handle POST requests (main logic)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read incoming JSON data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['searchQuery'])) {
        echo json_encode(['success' => false, 'message' => 'Missing search query']);
        exit();
    }

    // Log the search (you can replace this with actual logic to log into the database)
    $searchQuery = $data['searchQuery'];

    // Send a success response
    echo json_encode(['success' => true, 'message' => 'Search logged successfully']);
    exit();
}

http_response_code(405);  // Method Not Allowed for any non-POST and non-OPTIONS requests
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
