<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers to allow cross-origin requests
$allowedOrigins = ['https://lgbtqplusproject.org', 'https://www.lgbtqplusproject.org'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; // Get the request's origin

// Check if the origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");  // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");  // Allow necessary headers
header("Content-Type: application/json");  // Return JSON response

// Handle preflight request (CORS OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // Return a 200 status for preflight requests
    exit();  // Stop the script after handling OPTIONS request
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);  // Return a 405 status for disallowed methods
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
?>
