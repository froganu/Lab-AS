USE forum_db;

-- BORRAR TABLAS SI EXISTEN (primero views, luego tablas)
DROP VIEW IF EXISTS users;
DROP VIEW IF EXISTS posts;
DROP VIEW IF EXISTS comments;

DROP TABLE IF EXISTS t_003;
DROP TABLE IF EXISTS t_002;
DROP TABLE IF EXISTS t_001;

-- Crear tablas originales con nombres reales
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  auth_provider ENUM('manual', 'auth0') NOT NULL DEFAULT 'manual',
  provider_id VARCHAR(50) DEFAULT NULL,
  auth0_user_id VARCHAR(150) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bio TEXT DEFAULT NULL,       
  avatar LONGTEXT DEFAULT NULL, 
  UNIQUE(email, auth_provider)
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url LONGTEXT,
  tags VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Renombrar (obfuscación)
RENAME TABLE users TO t_001;
RENAME TABLE posts TO t_002;
RENAME TABLE comments TO t_003;

-- Cifrar
ALTER TABLE t_001 ENCRYPTION='Y';
ALTER TABLE t_002 ENCRYPTION='Y';
ALTER TABLE t_003 ENCRYPTION='Y';

-- Crear VIEWS con nombres reales
CREATE VIEW users AS SELECT * FROM t_001;
CREATE VIEW posts AS SELECT * FROM t_002;
CREATE VIEW comments AS SELECT * FROM t_003;
