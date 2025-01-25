-- Plantilla base para nuevas bases de datos
CREATE DATABASE IF NOT EXISTS {{DATABASE_NAME}}
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE {{DATABASE_NAME}};

-- Ejemplo de tabla
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
