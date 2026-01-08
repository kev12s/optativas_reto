<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$profile_code = $_GET['profile_code'] ?? '';
$email = $_GET['email'] ?? '';
$username = $_GET['username'] ?? '';
$telephone = $_GET['telephone'] ?? '';
$name = $_GET['name'] ?? '';
$surname = $_GET['surname'] ?? '';
$gender = $_GET['gender'] ?? '';
$card_no = $_GET['card_no'] ?? '';

$errors = [];

// profile_code: obligatorio y numérico
if ($profile_code === '' || !ctype_digit($profile_code)) {
  $errors['profile_code'] = 'Invalid profile code';
}

// email: obligatorio y formato válido
if ($email === '') {
  $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors['email'] = 'Invalid email format';
}

// username: obligatorio, 3-20
if ($username === '') {
  $errors['username'] = 'Username is required';
} elseif (strlen($username) < 3 || strlen($username) > 20) {
  $errors['username'] = 'Username must be between 3 and 20 characters';
} elseif (!preg_match('/^[a-zA-Z0-9._-]+$/', $username)) {
  $errors['username'] = 'Username can only contain letters, numbers, dot, underscore and hyphen';
}

// telephone: obligatorio, solo dígitos 9-15 (sin espacios)
$telephone_clean = preg_replace('/\s+/', '', $telephone);
if ($telephone_clean === '') {
  $errors['telephone'] = 'Telephone is required';
} elseif (!preg_match('/^\d{9,15}$/', $telephone_clean)) {
  $errors['telephone'] = 'Telephone must have 9 to 15 digits';
}

// name: obligatorio 2-50
if ($name === '') {
  $errors['name'] = 'Name is required';
} elseif (mb_strlen($name) < 2 || mb_strlen($name) > 50) {
  $errors['name'] = 'Name must be between 2 and 50 characters';
}

// surname: obligatorio 2-50
if ($surname === '') {
  $errors['surname'] = 'Surname is required';
} elseif (mb_strlen($surname) < 2 || mb_strlen($surname) > 50) {
  $errors['surname'] = 'Surname must be between 2 and 50 characters';
}

// gender: obligatorio, valores permitidos (AJUSTA a tus valores reales del select)
$gender = trim($_GET['gender'] ?? '');

error_log('GENDER_RAW: ' . json_encode($_GET['gender'] ?? null));
error_log('GENDER_NORM: ' . json_encode(mb_strtolower(trim($_GET['gender'] ?? ''))));
$gender_norm = mb_strtolower($gender);


$allowed_genders = ['man', 'female', 'other'];

if ($gender_norm === '') {
  $errors['gender'] = 'Gender is required';
} elseif (!in_array($gender_norm, $allowed_genders, true)) {
  $errors['gender'] = 'Invalid gender value';
}

// card_no: obligatorio, ejemplo 8-20 alfanum (AJUSTA a tu formato real)
if ($card_no === '') {
  $errors['card_no'] = 'Card number is required';
} elseif (!preg_match('/^[a-zA-Z0-9]{8,20}$/', $card_no)) {
  $errors['card_no'] = 'Card number must be 8-20 alphanumeric characters';
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
$modify = $controller->modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code);

if ($modify) {
  http_response_code(200);
  echo json_encode([
    "status" => "success",
    "code" => 200,
    "message" => "User modified correctly",
    "data" => ""
  ]);
} else {
  http_response_code(400);
  echo json_encode([
    "status" => "error",
    "code" => 400,
    "message" => "Error modifying the user ",
    "data" => ""
  ]);
}
?>