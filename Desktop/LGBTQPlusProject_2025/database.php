//
//  db_connection.php
//  
//
//  Created by Mateo Carnavali on 3/7/25.
//

<?php
$host = "cPanel.com";
$user = "lgbtqplusproject";
$password = "Rubenom3626#";
$database = "lgbtqplusproject";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
