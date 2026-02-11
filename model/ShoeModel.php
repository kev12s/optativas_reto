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
 
    public function get_unique_shoes_by_model()
    {
        $query = "SELECT MIN(ID) as ID, MODEL, BRAND, COLOR, ORIGIN, IMAGE_FILE, MIN(PRICE) as PRICE, 
                          GROUP_CONCAT(SIZE ORDER BY SIZE) as SIZES, SUM(STOCK) as STOCK
                  FROM SHOE 
                  GROUP BY MODEL, BRAND, COLOR, ORIGIN, IMAGE_FILE
                  ORDER BY MODEL";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
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
    
    public function getShoesByModel(string $model) {
        $query = "SELECT ID, PRICE, MODEL, SIZE, EXCLUSIVE, MANUFACTER_DATE, COLOR, ORIGIN, BRAND, RESERVED, STOCK, IMAGE_FILE
                  FROM SHOE 
                  WHERE MODEL = :model";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':model', $model);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $shoes = [];
        foreach ($result as $row) {
            $shoes[] = [
                "id" => (int)$row["ID"],
                "model" => $row["MODEL"],
                "description" => $row["BRAND"] . " - " . $row["COLOR"] . " (" . $row["ORIGIN"] . ")",
                "price" => (float)$row["PRICE"],
                "stock" => (int)($row["STOCK"] ?? 0),
                "image_file" => $row["IMAGE_FILE"],
                "sizes" => [ (int)$row["SIZE"] ]
            ];
        }
        
        return $shoes;
    }

    public function getSizesByModel(string $model) {
        $query = "SELECT DISTINCT SIZE FROM SHOE WHERE MODEL = :model ORDER BY SIZE";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':model', $model);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $sizes = [];
        foreach ($result as $row) {
            $sizes[] = (int)$row["SIZE"];
        }
        
        return $sizes;
    }
    
    public function insertOrder(array $data): int {
        $sql = "INSERT INTO ORDER_ (PROFILE_CODE, SHOE_ID, DATE_, QUANTITY)
                VALUES (:profile_code, :shoe_id, :date_, :quantity)";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindValue(':profile_code', (int)$data['profile_code']);
        $stmt->bindValue(':shoe_id', (int)$data['shoe_id']);
        $stmt->bindValue(':date_', $data['date_']);
        $stmt->bindValue(':quantity', (int)$data['quantity']);
        
        $stmt->execute();
        
        return (int)$this->conn->lastInsertId();
    }
}
?>