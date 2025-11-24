import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

dotenv.config();

// Fix dirname for ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct SSL paths
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "../ssl/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../ssl/server.cert")),
};

const PORT = process.env.PORT || 4430;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✔️ HTTPS Server running on https://localhost:${PORT}`);
});

