//
//  Untitled.swift
//  
//
//  Created by Mateo Carnavali on 3/15/25.
//
<!-- Archive.org Search Popup Box (Styled) -->
<style>
  /* Popup Box Styling (Customized) */
  .result-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-height: 80%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    z-index: 1000;
    animation: fadeIn 0.3s;
  }

  /* Close Button Styling */
  .close-popup-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #ff4d4d;
    border: none;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  /* Results Styling */
  #result {
    padding: 20px;
    font-family: Arial, sans-serif;
    color: #333;
  }

  /* Smooth Scrolling */
  .result-popup::-webkit-scrollbar {
    width: 8px;
  }
  .result-popup::-webkit-scrollbar-thumb {
    background-color: #4DA6FF;
    border-radius: 10px;
  }
  .result-popup::-webkit-scrollbar-thumb:hover {
    background-color: #1a73e8;
  }

  /* Fade-in Animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

</style>

<!-- Log Retrieval Page -->
<?php
// logRetrieval.php
$host = "localhost";
$username = "your_cpanel_username_youruser";
$password = "your_password";
$database = "your_cpanel_username_lgbtqplusproject";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM search_logs ORDER BY search_time DESC";
$result = $conn->query($sql);

?>
<!DOCTYPE html>
<html>
<head>
    <title>Search Logs</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f0f0f0; }
        table { border-collapse: collapse; width: 80%; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #4DA6FF; color: white; }
        tr:hover { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1 style="text-align: center;">Search Logs</h1>
    <table>
        <tr>
            <th>ID</th>
            <th>Query</th>
            <th>Search Time</th>
        </tr>
        <?php while($row = $result->fetch_assoc()) { ?>
        <tr>
            <td><?php echo $row['id']; ?></td>
            <td><?php echo $row['query']; ?></td>
            <td><?php echo $row['search_time']; ?></td>
        </tr>
        <?php } ?>
    </table>
</body>
</html>
<?php
$conn->close();
?>

