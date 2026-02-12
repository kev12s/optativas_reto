<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 
ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');
 
header('Content-Type: application/json; charset=utf-8');
 
require_once '../controller/controller.php';
 
$id = $_GET['id'] ?? '';
$price = $_GET['price'] ?? '';
$model = $_GET['model'] ?? '';
$size = $_GET['size'] ?? '';
$color = $_GET['color'] ?? '';
$origin = $_GET['origin'] ?? '';
$brand = $_GET['brand'] ?? '';
$stock = $_GET['stock'] ?? '';
 
$errors = [];
 
if ($id === '' || !ctype_digit($id)) {
  $errors['id'] = 'Invalid shoe ID';
}

if ($price === '') {
  $errors['price'] = 'Price is required';
} elseif (!is_numeric($price) || $price <= 0) {
  $errors['price'] = 'Price must be a positive number';
}

if ($model === '') {
  $errors['model'] = 'Model is required';
} elseif (mb_strlen($model) < 2 || mb_strlen($model) > 100) {
  $errors['model'] = 'Model must be between 2 and 100 characters';
}

if ($size === '') {
  $errors['size'] = 'Size is required';
} elseif (!is_numeric($size) || $size <= 0) {
  $errors['size'] = 'Size must be a positive number';
}

 
if ($color === '') {
  $errors['color'] = 'Color is required';
} elseif (mb_strlen($color) < 2 || mb_strlen($color) > 50) {
  $errors['color'] = 'Color must be between 2 and 50 characters';
}
 

if ($origin === '') {
  $errors['origin'] = 'Origin is required';
} elseif (mb_strlen($origin) < 2 || mb_strlen($origin) > 100) {
  $errors['origin'] = 'Origin must be between 2 and 100 characters';
}
 

if ($brand === '') {
  $errors['brand'] = 'Brand is required';
} elseif (mb_strlen($brand) < 2 || mb_strlen($brand) > 100) {
  $errors['brand'] = 'Brand must be between 2 and 100 characters';
}

if ($stock === '') {
  $errors['stock'] = 'Stock is required';
} elseif (!is_numeric($stock) || $stock < 0) {
  $errors['stock'] = 'Stock must be a non-negative number';
}

if (!empty($errors)) {
  http_response_code(422);
  echo json_encode([
    "status" => "error",
    "code" => 422,
    "message" => "Validation error",
    "errors" => $errors
  ]);
  exit;
}
 
$controller = new controller();
$modify = $controller->modifyShoe($id, $price, $model, $size, $color, $origin, $brand, $stock);
 
if ($modify) {
  http_response_code(200);
  echo json_encode([
    "status" => "success",
    "code" => 200,
    "message" => "Shoe modified correctly",
    "data" => ""
  ]);
} else {
  http_response_code(400);
  echo json_encode([
    "status" => "error",
    "code" => 400,
    "message" => "Error modifying the shoe",
    "data" => ""
  ]);
}
?>