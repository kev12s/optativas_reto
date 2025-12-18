<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

session_start();

if(isset($_SESSION['user'])){
    $user = $_SESSION['user'];
    unset($user['PSWD']);
    http_response_code(200);
    echo json_encode([
        "status" => "succes",
        "code" => 200,
        "Message" => "",
        "data"=> $user
    ]);
}else{
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "code" => 400,
        "Message" => "",
        "data" => ""]);
}

?>