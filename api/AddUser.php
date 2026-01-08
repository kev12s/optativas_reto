<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once '../controller/controller.php';
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$pswd1 = $input['pswd1'] ?? '';
$pswd2 = $input['pswd2'] ?? '';

$response = ["exito" => false];

try {

    $controller = new controller();
    $pswd_hash = password_hash($pswd1, PASSWORD_BCRYPT);
    $user = $controller->create_user($username, $pswd_hash);

    if ($user) {

        $_SESSION['user'] = $user;

        //JSON cambiado
        http_response_code(201); 
        echo json_encode([
            "status"  => "success",
            "code"    => 201,
            "message" => "User created correctly",
            "data"    => $user
        ], JSON_UNESCAPED_UNICODE);
       /* echo json_encode([
            'resultado' => $user,
            'exito' => true
        ], JSON_UNESCAPED_UNICODE);*/
    } else {

        //JSON cambiado
        http_response_code(400);
        echo json_encode([
            "status"  => "error",
            "code"    => 400,
            "message" => "User could not be created (maybe username already exists)",
            "data"    => null
        ]);
    }
} catch (Exception $e) {

    http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "code"    => 500,
            "message" => $e->getMessage(),
            "data"    => null
        ]);
    /*error_log($e->getMessage());
    echo json_encode([
        'error' => 'Error del servidor: ' . $e->getMessage(),
        'exito' => false
    ]);*/
}
?>

