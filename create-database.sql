-- BIMVerdi Database Setup
-- Kjør denne i phpMyAdmin: http://localhost:8888/phpMyAdmin

CREATE DATABASE IF NOT EXISTS `bimverdi` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Grant privileges (hvis nødvendig)
GRANT ALL PRIVILEGES ON bimverdi.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
