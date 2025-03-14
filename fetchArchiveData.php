//
//  save_snapshot.php
//  
//
//  Created by Mateo Carnavali on 3/14/25.
//

<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Allow CORS (cross-origin requests)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if identifier is provided
if (isset($_GET['identifier'])) {
    $identifier = htmlspecialchars($_GET['identifier']); // Sanitize input
    $url = "https://archive.org/metadata/" . $identifier;

    // Fetch data from Archive.org
    $response = @file_get_contents($url);

    if ($response !== FALSE) {
        echo $response;
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to retrieve data from Archive.org."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "No identifier provided."]);
}
