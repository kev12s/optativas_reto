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
     public function modifyShoe($id, $price, $model, $size, $color, $origin, $brand ,$stock)
    {

        $query = "UPDATE SHOE S 
        SET S.PRICE = :price, S.MODEL = :model, S.SIZE = :size, S.COLOR = :color, S.ORIGIN = :origin, S.BRAND = :brand,  S.STOCK = :stock
        WHERE S.ID = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindparam(':price', $price);
        $stmt->bindparam(':model', $model);
        $stmt->bindparam(':size', $size);
        $stmt->bindparam(':color', $color);
        $stmt->bindparam(':origin', $origin);
        $stmt->bindparam(':brand', $brand);
        $stmt->bindparam(':stock', $stock);
        $stmt->bindparam(':id', $id);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function delete_shoe($id)
    {
        try {
            // Start transaction for atomic operations
            $this->conn->beginTransaction();
            
            // First, delete all orders that reference this shoe
            $deleteOrdersQuery = "DELETE FROM ORDER_ WHERE SHOE_ID = :shoe_id";
            $deleteOrdersStmt = $this->conn->prepare($deleteOrdersQuery);
            $deleteOrdersStmt->bindparam(':shoe_id', $id);
            $deleteOrdersStmt->execute();
            
            // Then, delete the shoe
            $deleteShoeQuery = "DELETE FROM SHOE WHERE ID = :id";
            $deleteShoeStmt = $this->conn->prepare($deleteShoeQuery);
            $deleteShoeStmt->bindparam(':id', $id);
            $deleteShoeStmt->execute();
            
            // Commit the transaction
            $this->conn->commit();
            
            return true;
            
        } catch (PDOException $e) {
            // Rollback on error
            if ($this->conn->inTransaction()) {
                $this->conn->rollBack();
            }
            
            // Log error for debugging
            error_log("Error deleting shoe and orders: " . $e->getMessage());
            
            return false;
        }
    }
}
?>