<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$id = $_GET['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "code" => 400,
        "message" => "ID is required",
        "data" => ""
    ]);
    exit;
}

$controller = new controller();
$result = $controller->delete_shoe($id);

if ($result === true) {
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "code" => 200,
        "message" => "Sneaker and associated orders deleted successfully",
        "data" => ""
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "code" => 500,
        "message" => "Failed to delete sneaker",
        "data" => ""
    ]);
}
?>