<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$input = json_decode(file_get_contents('php://input'), true);
$profile_code = $input['profile_code'] ?? '';
$password = $input['password'] ?? '';


$controller = new controller();
$modify = $controller->modifyPassword($profile_code, $password);

if ($modify) {
    echo json_encode(["status" => "success",
  "code" => 200,
  "message" => "Password correctly modified"]);
} else {
    echo json_encode(["status" => "error",
  "code" => 400,
  "message" => "Error modifying the password"]);
}
?>