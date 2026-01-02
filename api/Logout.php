<?php

session_start();
if(session_destroy()){
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "code" => 200,
        "message" => "Session destroyed successfully", 
        "data" => ""
    ]);
}else{
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "code" => 400,
        "message" => "Session not destroyed", 
        "data" => ""
    ]);
}

?>