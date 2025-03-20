<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers (for OPTIONS and POST)
header("Access-Control-Allow-Origin: https://www.lgbtqplusproject.org");  // Allow the origin of your site
header("Access-Control-Allow-Methods: POST, OPTIONS");  // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow necessary headers
header("Content-Type: application/json");  // Return JSON response

// Handle the OPTIONS request (preflight CORS check)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // Return 200 for OPTIONS requests
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

    // Log the search query or perform your actions here
    $searchQuery = $data['searchQuery'];

    // Send success response
    echo json_encode(['success' => true, 'message' => 'Search logged successfully']);
    exit();
}

// Default response if method is not POST or OPTIONS
http_response_code(405);  // Method Not Allowed
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>
