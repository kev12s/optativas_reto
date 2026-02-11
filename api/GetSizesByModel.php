<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$controller = new controller();

if (isset($_GET['model'])) {
    $model = $_GET['model'];
    $sizes = $controller->getSizesByModel($model);
    
    if ($sizes) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "code" => 200,
            "message" => "",
            "data" => $sizes
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "code" => 400,
            "message" => "No sizes found for this model",
            "data" => ""
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "code" => 400,
        "message" => "Model parameter is required",
        "data" => ""
    ]);
}
?>
