<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Headers (Allow requests from all origins)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type': 'application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // Send OK status for OPTIONS request
    exit();
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['searchQuery'])) {
        echo json_encode(['success' => false, 'message' => 'Missing search query']);
        exit();
    }

    $searchQuery = $data['searchQuery'];

    // Mock response to confirm it works
    echo json_encode(['success' => true, 'message' => 'Search logged successfully: ' . $searchQuery]);
    exit();
}

// If the request is not POST or OPTIONS, return 405 Method Not Allowed
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
?>
