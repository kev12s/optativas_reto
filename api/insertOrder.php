<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

function fail(string $msg) {
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);
if (!is_array($data)) {
    fail("Invalid JSON");
}

$profile_code = $data['profile_code'] ?? null;
$shoe_id = $data['shoe_id'] ?? null;
$quantity = $data['quantity'] ?? 1;

if (!$profile_code || !$shoe_id) {
    fail("Profile code and shoe ID are required");
}

if (!is_numeric($profile_code) || !is_numeric($shoe_id) || !is_numeric($quantity)) {
    fail("Invalid data format");
}

if ((int)$quantity <= 0) {
    fail("Quantity must be greater than 0");
}

try {
    $controller = new controller();
    
    $orderData = [
        'profile_code' => (int)$profile_code,
        'shoe_id' => (int)$shoe_id,
        'date_' => date('Y-m-d'),
        'quantity' => (int)$quantity
    ];
    
    $orderId = $controller->insertOrder($orderData);
    
    if ($orderId) {
        echo json_encode([
            'success' => true,
            'order_id' => $orderId,
            'message' => 'Order created successfully'
        ]);
    } else {
        fail("Failed to create order");
    }
} catch (Throwable $e) {
    fail("Database error: " . $e->getMessage());
}
?>
