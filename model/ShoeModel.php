<?php 
require_once 'Shoe.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');
class ShoeModel
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function get_all_shoes()
    {
        $query = "SELECT * FROM SHOE";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
}
?>