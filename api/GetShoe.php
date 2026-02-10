<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');

header("Content-Type: application/json; charset=utf-8");

require_once '../controller/controller.php';

session_start();

// 1) Leer shoe_id desde la URL (GET)
//    Acepto "shoe_id" y también "id_shoe" por si lo usáis así.
$shoe_id = $_GET['shoe_id'] ?? ($_GET['id_shoe'] ?? '');

if ($shoe_id === '' || !ctype_digit($shoe_id)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "code" => 400,
        "message" => "Invalid shoe_id",
        "data" => null
    ]);
    exit;
}

try {
    $controller = new controller();

    // 2) Pedimos al controller la zapatilla por ID
    $shoe = $controller->getShoeById((int)$shoe_id);

    // 3) Si no existe, 404
    if (is_null($shoe)) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "code" => 404,
            "message" => "Shoe not found",
            "data" => null
        ]);
        exit;
    }

    // 4) Si existe, devolvemos success
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "code" => 200,
        "message" => "Shoe found correctly",
        "data" => $shoe
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "code" => 500,
        "message" => "Server error",
        "data" => null,
        "detail" => $e->getMessage()
    ]);
}
?>
