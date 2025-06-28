const express = require("express");
const router = express.Router();

const TransferService = require("../../application/TransferService");
const MongoTransferRepository = require("../../infrastructure/mongodb/MongoTransferRepository");
const MongoCompanyRepository = require("../../infrastructure/mongodb/MongoCompanyRepository");

const { validateTransfer } = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

const transferRepo = new MongoTransferRepository();
const companyRepo = new MongoCompanyRepository();

const transferService = new TransferService(transferRepo, companyRepo);

// GET companies with transfers last month (paginated)
router.get("/companies-last-month", authMiddleware, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    if (limit > 50) limit = 50;

    const companies = await transferService.getCompaniesWithTransfersLastMonth(limit, offset);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create transfer
router.post("/", authMiddleware, validateTransfer, async (req, res) => {
  try {
    const transfer = await transferService.createTransfer(req.body);
    res.status(201).json(transfer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;