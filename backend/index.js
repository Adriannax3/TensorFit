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
