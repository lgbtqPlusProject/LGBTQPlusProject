//
//  save_snapshot.php
//  
//
//  Created by Mateo Carnavali on 3/14/25.
//


<?php
// Allow cross-origin requests from your frontend domain
header("Access-Control-Allow-Origin: https://your-frontend-domain.com"); // Replace with your frontend domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = 'sv15.byethost15.org'; // or the host of your database
$dbname = 'lgbtqplu_lgbtqplusproject';
$username = 'lgbtqplu_timo'';
$password = 'Rubenom3626#';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the search query from the request
    if (isset($_POST['query'])) {
        $query = $_POST['query'];

        // Prepare the SQL statement to insert the search query
        $stmt = $pdo->prepare("INSERT INTO search_logs (query, timestamp) VALUES (:query, NOW())");
        $stmt->bindParam(':query', $query, PDO::PARAM_STR);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    } else {
        echo json_encode(['status' => 'no_query']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
