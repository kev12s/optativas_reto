<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$controller = new controller();
$shoes = $controller->get_all_shoes();

if ($shoes) {
    http_response_code(200);
  echo json_encode([
    "status" => "success",
    "code" => 200,
    "message" => "",
    "data" => $shoes
  ]);
    /*echo json_encode([
        'resultado' => $users
    ], JSON_UNESCAPED_UNICODE);*/
} else {
     http_response_code(400);
  echo json_encode([
    "status" => "error",
    "code" => 400,
    "message" => "Not shoes found",
    "data" => ""
  ]);
   // echo json_encode(['error' => 'No se ha encontrado usuarios']);
}
?>