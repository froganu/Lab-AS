import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js"; //route general

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //estas dos lineas se eliminaran cuando se quite el html

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public"))); // se elimina cuando se quite el html

app.use("/api", routes);

// Redirección inicial dependiendo de si hay sesión
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "redirect.html")); //cuando se quite el html, pues tambien se quitara esto pero la logica deberia ser la misma
});

export default app;

