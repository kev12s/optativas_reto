<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

function fail(string $msg) {
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

$model = $_GET['model'] ?? '';

if (empty($model)) {
    fail("Model name is required");
}

// Proper URL decoding
$model = urldecode($model);
$model = trim($model);

// Debug: log the received model
error_log("Received model: " . $model);

try {
    $controller = new controller();
    $shoes = $controller->getShoesByModel($model);
    
    if ($shoes) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'code' => 200,
            'message' => 'Shoes found correctly',
            'data' => $shoes
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'code' => 404,
            'message' => 'No shoes found for this model',
            'data' => null
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'code' => 500,
        'message' => 'Database error: ' . $e->getMessage(),
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}
?>
