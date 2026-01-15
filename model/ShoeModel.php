<?php
require_once '../config/Database.php';

class ShoeModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getShoeById(int $shoe_id) {
        $sql = "SELECT ID, PRICE, MODEL, SIZE, EXCLUSIVE, MANUFACTER_DATE, COLOR, ORIGIN, BRAND, RESERVED, STOCK
                FROM SHOE
                WHERE ID = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $shoe_id, PDO::PARAM_INT);
        $stmt->execute();

        $shoe = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$shoe) {
            return null;
        }

        // Adaptación a lo que espera tu paintShoe() en JS:
        // No hay imagen de momento (creamos una)
        return [
            "id" => (int)$shoe["ID"],
            "model" => $shoe["MODEL"],
            "description" => $shoe["BRAND"] . " - " . $shoe["COLOR"] . " (" . $shoe["ORIGIN"] . ")",
            "price" => (float)$shoe["PRICE"],
            "stock" => (int)($shoe["STOCK"] ?? 0),
            "image" => "../assets/img/shoes/example_shoe.png",
            "sizes" => [ (int)$shoe["SIZE"] ]
        ];
    }
}
?>
