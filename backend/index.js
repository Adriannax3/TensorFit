const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "tensorfit-api", ts: Date.now() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`),
);
