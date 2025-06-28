require("dotenv").config();
const express = require("express");
const { connect } = require("../infrastructure/mongodb/connection");

const companyRoutes = require("./routes/companyRoutes");
const transferRoutes = require("./routes/transferRoutes");

const app = express();

app.use(express.json());

// Rutas prefijadas:
app.use("/companies", companyRoutes); // /companies/adhered, /companies/adhere
app.use("/transfers", transferRoutes); // /transfers/companies-last-month, /transfers (POST)

// Manejo de errores no atrapados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to connect DB", err);
  });

module.exports = app; // para testing