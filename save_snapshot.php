//
//  save_snapshot.php
//  
//
//  Created by Mateo Carnavali on 3/14/25.
//

<?php
$servername = "sv15.byethost15.org";
$username = "lgbtqplu_timo";
$password = "Rubenom3626#";
$dbname = "lgbtqplu_lgbtqplusproject";

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if data was received
if (isset($_POST['url']) && isset($_POST['date']) && isset($_POST['snapshotUrl'])) {

    // Get data from the AJAX request
    $url = $conn->real_escape_string($_POST['url']);
    $date = $conn->real_escape_string($_POST['date']);
    $snapshotUrl = $conn->real_escape_string($_POST['snapshotUrl']);

    // Insert data into historicalFigures table
    $sql = "INSERT INTO historicalFigures (name, event_year, country, description) VALUES ('$url', '$date', 'Online', '$snapshotUrl')";

    if ($conn->query($sql) === TRUE) {
        echo "Snapshot saved successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

} else {
    echo "No data received from the request.";
}

$conn->close();
?>
