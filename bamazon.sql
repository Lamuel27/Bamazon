CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(30) AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INTEGER(30)
    );
    
INSERT INTO products(product_name, department_name, price ,stock_quantity)
VALUES ("Ekko Spot", "Electronics", 50.47, 545),
		("Instant Pot", "Kitchen", 90.00, 400),
        ("Bamazon Water TV Stick", "Electronics", 24.99, 738),
        ("Citizen Watch", "Fashion", 139.00, 349),
        ("Meeseeks Box", "Electronics", 3.99, 674),
        ("Chef's Knife Set", "Kitchen", 37.25, 490),
        ("Keurig", "Kitchen", 119.99, 45),
        ("Roomba", "Electronics", 299.86, 121),
        ("Bamazon Kindle", "Electronics", 60.00, 645),
        ("Bose Sound Bar", "Electronics", 205.99, 235);
    
SELECT * FROM products;