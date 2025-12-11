<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$profile_code = $_GET['profile_code'] ?? '';
$email = $_GET['email'] ?? '';
$username = $_GET['username'] ?? '';
$telephone = $_GET['telephone'] ?? '';
$name = $_GET['name'] ?? '';
$surname = $_GET['surname'] ?? '';
$current_account = $_GET['current_account'] ?? '';

$controller = new controller();
$modify = $controller->modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code);

if ($modify) {
  http_response_code(200);
  echo json_encode([
    "status" => "success",
    "code" => 200,
    "message" => "Admin correctly modified",
    "data" => ""
  ]);

} else {
  http_response_code(400);
  echo json_encode([
    "status" => "error",
    "code" => 400,
    "message" => "Error modifying the admin",
    "data" => ""
  ]);
}
?>