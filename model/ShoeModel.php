<?php
require_once '../config/Database.php';

class ShoeModel {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getShoeById(int $shoe_id) {
        $sql = "SELECT ID, PRICE, MODEL, SIZE, EXCLUSIVE, MANUFACTER_DATE, COLOR, ORIGIN, BRAND, RESERVED, STOCK, IMAGE_FILE
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

        
        return [
            "id" => (int)$shoe["ID"],
            "model" => $shoe["MODEL"],
            "description" => $shoe["BRAND"] . " - " . $shoe["COLOR"] . " (" . $shoe["ORIGIN"] . ")",
            "price" => (float)$shoe["PRICE"],
            "stock" => (int)($shoe["STOCK"] ?? 0),
            "image_file" => $shoe["IMAGE_FILE"],
            "sizes" => [ (int)$shoe["SIZE"] ]
        ];
    }

    public function insertShoe(array $data): int {
        $sql = "INSERT INTO SHOE
                (PRICE, MODEL, SIZE, EXCLUSIVE, MANUFACTER_DATE, COLOR, ORIGIN, BRAND, RESERVED, STOCK, IMAGE_FILE)
                VALUES
                (:price, :model, :size, :exclusive, :mdate, :color, :origin, :brand, :reserved, :stock, :image_file)";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':price', (float)$data['price']);
        $stmt->bindValue(':model', $data['model']);
        $stmt->bindValue(':size', (float)$data['size']);
        $stmt->bindValue(':exclusive', $data['exclusive']); // 'TRUE' / 'FALSE'
        $stmt->bindValue(':mdate', $data['manufacture_date']); // null o 'YYYY-MM-DD'
        $stmt->bindValue(':color', $data['color']);
        $stmt->bindValue(':origin', $data['origin']);
        $stmt->bindValue(':brand', $data['brand']);
        $stmt->bindValue(':reserved', $data['reserved']); // 'TRUE' / 'FALSE'
        $stmt->bindValue(':stock', $data['stock']); // null o int
        $stmt->bindValue(':image_file', $data['image_file']); // default_shoe.png

        $stmt->execute();

        return (int)$this->conn->lastInsertId();
    }

}
?>
