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
        echo json_encode([
            'success' => true,
            'data' => $shoes
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No shoes found for this model'
        ]);
    }
} catch (Throwable $e) {
    fail("Database error: " . $e->getMessage());
}
?>
