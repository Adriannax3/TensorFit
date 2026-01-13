require('dotenv').config();
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error("Brak pliku .env! Przykładowy plik znajduje się w .env.example");
  process.exit(1);
}
// check example variable
const requiredEnv = ["PORT", "JWT_SECRET", "DB_NAME", "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_PORT"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Brak wymaganej zmiennej środowiskowej: ${key}. Sprawdź .env.example`);
    process.exit(1);
  }
}

const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const routes = require("./routes");
const models = require ("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`API listening on http://localhost:${PORT}`);

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true }).then(() => {
        console.log('Tabele zaktualizowane zgodnie z modelami');
      });
      console.log('Połączono z PostgreSQL');
    } catch (error) {
      console.error(error);
    }
  }
);
