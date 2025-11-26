


-- ============================================
-- SECCIÓN 0: LIMPIEZA (BORRAR TABLAS VIEJAS)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- SECCIÓN 1: CREAR TODAS LAS TABLAS
-- ============================================

-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Tabla de categorías
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    category_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
-- SECCIÓN 2: INSERTAR DATOS INICIALES
-- ============================================

-- Insertar roles predeterminados
INSERT INTO roles (name, description, created_at) VALUES 
('ADMIN', 'Administrator with full access', NOW()),
('CUSTOMER', 'Customer with limited access', NOW());

-- Crear usuario admin por defecto (password: admin123)
INSERT INTO users (username, email, password, role_id, created_at, updated_at) VALUES 
('admin', 'admin@marketplace.com', '$2b$10$H4SDQScWeL9Pl38pBC0NPuVwdEGyG0wu7yeccvF4IjBaa1cEy7LhG', 1, NOW(), NOW());

-- Insertar categorías predeterminadas
INSERT INTO categories (name, description, created_at, updated_at) VALUES 
('Electrónica', 'Dispositivos electrónicos y tecnología', NOW(), NOW()),
('Ropa', 'Ropa y accesorios de moda', NOW(), NOW()),
('Hogar', 'Artículos para el hogar y decoración', NOW(), NOW()),
('Deportes', 'Equipamiento deportivo y fitness', NOW(), NOW()),
('Libros', 'Libros y material educativo', NOW(), NOW()),
('Juguetes', 'Juguetes y juegos para niños', NOW(), NOW());

-- Insertar productos de ejemplo
INSERT INTO products (nombre, precio, descripcion, category_id, image_url, created_at, updated_at) VALUES 
('Laptop Dell XPS 13', 1299.99, 'Laptop ultraportátil con procesador Intel Core i7', 1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', NOW(), NOW()),
('iPhone 14 Pro', 999.99, 'Smartphone Apple con cámara de 48MP', 1, 'https://images.unsplash.com/photo-1592286927505-fa026c83704f', NOW(), NOW()),
('Camiseta Nike', 29.99, 'Camiseta deportiva de algodón', 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', NOW(), NOW()),
('Sofá 3 plazas', 599.99, 'Sofá cómodo para sala de estar', 3, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', NOW(), NOW()),
('Bicicleta de montaña', 450.00, 'Bicicleta todo terreno 21 velocidades', 4, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91', NOW(), NOW()),
('Clean Code', 42.99, 'Libro de programación por Robert C. Martin', 5, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', NOW(), NOW()),
('LEGO Star Wars', 79.99, 'Set de construcción LEGO', 6, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', NOW(), NOW());


