<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$model = $_GET['model'] ?? '';
$size = $_GET['size'] ?? '';

if (empty($model) || empty($size)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'code' => 400,
        'message' => 'Model and size parameters are required',
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $controller = new controller();
    $shoes = $controller->getShoesByModel($model);
    
    if ($shoes) {
        // Find the shoe with matching size
        $matchingShoe = null;
        foreach ($shoes as $shoe) {
            if (floatval($shoe['SIZE']) === floatval($size)) {
                $matchingShoe = $shoe;
                break;
            }
        }
        
        if ($matchingShoe) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'code' => 200,
                'message' => 'Shoe found correctly',
                'data' => $matchingShoe
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'code' => 404,
                'message' => 'No shoe found for this model and size',
                'data' => null
            ], JSON_UNESCAPED_UNICODE);
        }
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
