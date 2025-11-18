import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js"; // Solo API

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

// Si quieres una redirección automática puedes hacer:
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;

