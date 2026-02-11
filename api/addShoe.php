<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Database.php';
require_once '../model/ShoeModel.php';

function fail(string $msg) {
    echo json_encode(['success' => false, 'error' => $msg]);
    exit;
}


$input = file_get_contents("php://input");
$data = json_decode($input, true);
if (!is_array($data)) {
    fail("Invalid JSON");
}


$brand  = trim($data['brand'] ?? '');
$model  = trim($data['model'] ?? '');
$size   = $data['size'] ?? null;
$color  = trim($data['color'] ?? '');
$origin = trim($data['origin'] ?? '');
$manufacture_date = $data['manufacture_date'] ?? null;
$stock  = $data['stock'] ?? null;
$price  = $data['price'] ?? null;

$exclusive = $data['exclusive'] ?? 'FALSE';
$reserved  = $data['reserved'] ?? 'FALSE';

/* Validaciones */
$allowedBrands = ['Nike', 'Adidas', 'Puma'];
if ($brand === '' || !in_array($brand, $allowedBrands, true)) fail("Brand inválida");

if ($model === '' || strlen($model) > 30) fail("Model inválido");
if ($color === '' || strlen($color) > 20) fail("Color inválido");
if ($origin === '' || strlen($origin) > 20) fail("Origin inválido");

if ($size === null || !is_numeric($size)) fail("Size inválido");
if ($price === null || !is_numeric($price) || (float)$price <= 0) fail("Price inválido");

/* que stock no sean null */
if ($stock !== null && $stock !== '') {
    if (!is_numeric($stock) || (int)$stock < 0) fail("Stock inválido");
    $stock = (int)$stock;
} else {
    $stock = null;
}

/* que fecha no sean null */
if ($manufacture_date !== null && $manufacture_date !== '') {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $manufacture_date)) fail("Manufacture date inválida");
} else {
    $manufacture_date = null;
}

/* Normalizar enums */
$exclusive = ($exclusive === 'TRUE') ? 'TRUE' : 'FALSE';
$reserved  = ($reserved === 'TRUE') ? 'TRUE' : 'FALSE';

/* 4) Imagen por defecto */
$image_file = "default_shoe.png";

try {
    $database = new Database();
    $db = $database->getConnection();
    $shoeModel = new ShoeModel($db);

    $newId = $shoeModel->insertShoe([
        'price' => (float)$price,
        'model' => $model,
        'size' => (float)$size,
        'exclusive' => $exclusive,
        'manufacture_date' => $manufacture_date,
        'color' => $color,
        'origin' => $origin,
        'brand' => $brand,
        'reserved' => $reserved,
        'stock' => $stock,
        'image_file' => $image_file
    ]);

    echo json_encode(['success' => true, 'id' => $newId]);

} catch (Throwable $e) {
    fail("Database error");
}
