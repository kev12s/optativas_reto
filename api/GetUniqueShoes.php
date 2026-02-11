<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$controller = new controller();
$shoes = $controller->get_unique_shoes_by_model();

if ($shoes) {
    http_response_code(200);
  echo json_encode([
    "status" => "success",
    "code" => 200,
    "message" => "",
    "data" => $shoes
  ]);
} else {
     http_response_code(400);
  echo json_encode([
    "status" => "error",
    "code" => 400,
    "message" => "No shoes found",
    "data" => ""
  ]);
}
?>
