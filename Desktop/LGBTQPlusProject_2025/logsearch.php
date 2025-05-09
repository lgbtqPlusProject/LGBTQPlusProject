<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow cross-origin requests from the main site
header("Access-Control-Allow-Origin: https://www.lgbtqplusproject.org");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight request with necessary headers
    header("Access-Control-Max-Age: 3600"); // Cache preflight response for 1 hour
    exit(0); // Exit after handling OPTIONS request
}

// Database credentials
$servername = "sv15.byethost15.org";  // Replace with your iFastNet MySQL server name
$username = "lgbtqplu_timo";           // Replace with your iFastNet MySQL username
$password = "Rubenom3626#";           // Replace with your iFastNet MySQL password
$dbname = "lgbtqplu_lgbtqplusproject";          // Your MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}


// Get the raw POST data from the request
$data = file_get_contents("php://input");

// Decode the JSON data into an associative array
$request = json_decode($data, true);

// Check if 'searchQuery' exists and is valid
if (isset($request['searchQuery']) && !empty($request['searchQuery'])) {
    // Assuming your logging logic works
    echo json_encode(["success" => true, "message" => "Search logged successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Search query is missing or empty."]);
}

    // Insert the search term into your database table
    $sql = "INSERT INTO search_logs (query, search_time) VALUES ('$query, '$search_time')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Search logged successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $sql . " - " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No search term provided."]);
}

$conn->close();
?>
