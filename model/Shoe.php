<?php

class Shoe {
    private $id;
    private $price;
    private $model;
    private $size;
    private $exclusive;
    private $manufacture_date;
    private $color;
    private $origin;
    private $brand;
    private $reserved;
    private $stock;


    public function __construct($id, $price, $model, $size, $exclusive, $manufacture_date, $color, $origin, $brand, $reserved, $stock) {
        $this->id = $id;
        $this->price = $price;
        $this->model = $model;
        $this->size = $size;
        $this->exclusive = $exclusive;
        $this->manufacture_date = $manufacture_date;
        $this->color = $color;
        $this->origin = $origin;
        $this->brand = $brand;
        $this->reserved = $reserved;
        $this->stock = $stock;
        }
    public function getid() {
        return $this->id; 
    }
    public function setid($id) {
        $this->id = $id;
    }

    public function getprice() {
        return $this->price;
    }
    public function setprice($price) {
        $this->price = $price;
    }
    public function getmodel() {
        return $this->model;
    }
    public function setmodel($model) {
        $this->model = $model;
    }
    public function getsize() {
        return $this->size;
    }
    public function setsize($size) {
        $this->size = $size;
    }
    public function getexclusive() {
        return $this->exclusive;
    }
    public function setexclusive($exclusive) {
        $this->exclusive = $exclusive;
    }
    public function getmanufacture_date() {
        return $this->manufacture_date;
    }
    public function setmanufacture_date($manufacture_date) {
        $this->manufacture_date = $manufacture_date;
    }
    public function getcolor() {
        return $this->color;
    }
    public function setcolor($color) {
        $this->color = $color;
    }
    public function getorigin() {
        return $this->origin;
    }
    public function setorigin($origin) {
        $this->origin = $origin;
    }
    public function getbrand() {
        return $this->brand;
    }
    public function setbrand($brand) {
        $this->brand = $brand;
    }
    public function getreserved() {
        return $this->reserved;
    }
    public function setreserved($reserved) {
        $this->reserved = $reserved;
    }
    public function getstock() {
        return $this->stock;
    }
    public function setstock($stock) {
        $this->stock = $stock;
    }

    public function __toString() {
        return "ID: " . $this->id . " - Price: " . $this->price . " - Model: " . $this->model . " - Size: " . $this->size . " - Exclusive: " . $this->exclusive . " - Manufacture Date: " . $this->manufacture_date . " - Color: " . $this->color . " - Origin: " . $this->origin . " - Brand: " . $this->brand . " - Reserved: " . $this->reserved . " - Stock: " . $this->stock;
    }    
}

?>