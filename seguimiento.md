# Seguimiento del Proyecto – Foro Web

- Creación del backend con **Node.js + Express**, incluyendo los módulos:
  - `express` → servidor principal.  
  - `cors` → control de peticiones cruzadas.  
  - `dotenv` → manejo de variables de entorno.  
  - `morgan` → registro de peticiones HTTP.  
  - `bcrypt` → cifrado seguro de contraseñas.  
  - `nodemon` → reinicio automático durante desarrollo.  
- Estructura:

```
src/
├── config/        → conexión con la base de datos
├── controllers/   → lógica de negocio
├── routes/        → endpoints de la API
├── models/        → (pendiente, para ORM o futuras entidades)
└── public/        → HTML, CSS y JS estáticos
```

---

- Creación de la base de datos **forum_db** y del usuario de conexión **forum_user**:

```sql
CREATE DATABASE forum_db;
CREATE USER 'forum_user'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON forum_db.* TO 'forum_user'@'localhost';
FLUSH PRIVILEGES;
```

- En Docker, las mismas credenciales se definen en `docker-compose.yml`:

```yaml
MYSQL_DATABASE: forum_db
MYSQL_USER: forum_user
MYSQL_PASSWORD: 1234
MYSQL_ROOT_PASSWORD: root
```

- Conexión mediante variables de entorno:

```
DB_HOST=db
DB_USER=forum_user
DB_PASS=1234
DB_NAME=forum_db
```

---


Definida en `docker-init/01_schema.sql`, ejecutada automáticamente al crear el contenedor de MySQL.

### Tablas implementadas

#### 🧍 `users`
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- Guarda los datos de usuario y rol.
- Las contraseñas se guardan **cifradas con bcrypt**:
  ```js
  const hashedPassword = await bcrypt.hash(password, 10);
  ```

#### 📝 `posts`
```sql
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  tags VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 💬 `comments`
```sql
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

##  Interfaz HTML (temporal) -> será sustituida por React, era para probar.

- Páginas servidas por Express:
  - `login.html`
  - `register.html`
  - `forum.html`
  - `redirect.html`
- Control de sesión con **localStorage**:
  - Si hay sesión → acceso al foro.
  - Si no hay sesión → redirección a login.

---

## Dockerización

### Servicios definidos en `docker-compose.yml`

| Servicio | Imagen | Puerto | Descripción |
|-----------|---------|---------|-------------|
| `db` | `mysql:8.0` | 3307:3306 | Base de datos MySQL |
| `backend` | `node:20` | 4000:4000 | Servidor Node/Express |

### Volúmenes

- `db_data`: persiste los datos de MySQL.  
- `./docker-init`: contiene scripts SQL de inicialización.

### Despliegue rápido

```bash
docker compose up --build
```

- Backend disponible en: [http://localhost:4000](http://localhost:4000)  
- Base de datos:
  - **Host:** localhost  
  - **Puerto:** 3307  
  - **Usuario:** forum_user  
  - **Contraseña:** 1234  
  - **Base de datos:** forum_db  

### Acceso manual a la base de datos

```bash
mysql -h localhost -P 3307 -uforum_user -p1234 forum_db
```

---

- Configuración de volumen compartido (`- .:/app`) para edición en tiempo real desde fuera del contenedor.  
- `nodemon` reinicia el backend automáticamente ante cualquier cambio.  
- Cada compañero obtiene su propia base de datos local (no compartida).  
- No se necesita instalar Node ni MySQL localmente, solo Docker y Docker Compose.

---

## 🔒 Seguridad implementada

- Contraseñas cifradas con **bcrypt** (`bcrypt.hash(password, 10)`).  
- Ninguna contraseña se almacena en texto plano.  

---

---

## ✅ Comandos útiles

| Acción                                   | Comando                                               |
| ---------------------------------------- | ----------------------------------------------------- |
| Levantar todo                            | `docker compose up --build`                           |
| Ver contenedores activos                 | `docker ps`                                           |
| Entrar al contenedor del backend         | `docker exec -it forum-backend bash`                  |
| Entrar al contenedor de la base de datos | `docker exec -it forum-db mysql -uroot -proot`        |
| Detener contenedores                     | `docker compose down`                                 |
| Reiniciar todo limpio (reinicializa DB)  | `docker compose down -v && docker compose up --build` |

---

## 🧱 Notas finales

- El archivo `docker-init/01_schema.sql` se ejecuta **solo la primera vez** que se crea el contenedor de MySQL.  
  Para reinicializar la base de datos:  
  ```bash
  docker compose down -v && docker compose up --build
  ```
- Cada compañero puede conectarse a su propia base de datos con herramientas como **DBeaver** o **MySQL Workbench** usando:
  ```
  Host: localhost
  Port: 3307
  User: forum_user
  Password: 1234
  Database: forum_db
  ```

