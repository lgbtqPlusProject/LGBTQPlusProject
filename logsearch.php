<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight request (CORS OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Return "Method Not Allowed" if not POST
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

// Read incoming data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Check if JSON decoding worked
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON format."]);
    exit();
}

// Check if 'searchQuery' is provided
if (!isset($data['searchQuery'])) {
    echo json_encode(["success" => false, "message" => "No search query provided."]);
    exit();
}

$searchQuery = $data['searchQuery'];

// Simulate logging search (replace this with your actual database code)
echo json_encode(["success" => true, "message" => "Search logged successfully."]);
