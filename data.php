<?php
$servername = "localhost"; 
$username = "students";   
$password = "0993"; 
$dbname = "students_database";   

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Close connection
$conn->close();
?>

<?php
date_default_timezone_set('Africa/Harare');
$currentDateTime = date('Y-m-d H:i:s');
echo "<h1>Current Date and Time</h1>";
echo "<p>$currentDateTime</p>";
?>