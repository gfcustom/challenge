const express = require("express");
const router = express.Router();

const CompanyService = require("../../application/CompanyService");
const MongoCompanyRepository = require("../../infrastructure/mongodb/MongoCompanyRepository");

const { validateCompanyAdhesion } = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

const companyRepo = new MongoCompanyRepository();
const companyService = new CompanyService(companyRepo);

// GET companies adhered in last month (paginated)
router.get("/adhered", authMiddleware, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    // Limites maximos para seguridad
    if (limit > 50) limit = 50;

    const companies = await companyService.getCompaniesAdheredLastMonth(limit, offset);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST adhere new company
router.post("/adhere", authMiddleware, validateCompanyAdhesion, async (req, res) => {
  try {
    const result = await companyService.adhereCompany(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;