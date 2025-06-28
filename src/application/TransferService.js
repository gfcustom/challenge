const Transfer = require("../domain/entities/Transfer");

class TransferService {
  /**
   * 
   * @param {ITransferRepository} transferRepository 
   */
  constructor(transferRepository, companyRepository) {
    this.transferRepository = transferRepository;
    this.companyRepository = companyRepository;
  }

  /**
   * Guarda una transferencia
   * @param {Object} transferData
   * @param {number} transferData.amount
   * @param {string} transferData.companyId (CUIT)
   * @param {string} transferData.debitAccount
   * @param {string} transferData.creditAccount
   * @param {string} transferData.date ISO string
   */
  async createTransfer({ amount, companyId, debitAccount, creditAccount, date }) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Importe inválido");
    }
    // Validations for CUIT format + accounts minimal check
    if (!/^\d{2}-\d{8}-\d{1}$/.test(companyId)) {
      throw new Error("CUIT inválido para transferencia");
    }
    if (!debitAccount || !creditAccount) {
      throw new Error("Cuentas débito y crédito deben estar definidas");
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Fecha de transferencia inválida");
    }

    // Verificar empresa existe:
    const company = await this.companyRepository.findByCuit(companyId);
    if (!company) {
      throw new Error("Empresa no existe para transferencia");
    }

    const transfer = new Transfer({
      amount,
      companyId,
      debitAccount,
      creditAccount,
      date: dateObj
    });

    return this.transferRepository.save(transfer);
  }

  /**
   * Trae empresas que hicieron transferencias el último mes
   * @param {number} limit 
   * @param {number} offset
   */
  async getCompaniesWithTransfersLastMonth(limit = 10, offset = 0) {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - 30);

    // Obtenemos las transferencias desde fromDate
    const transfers = await this.transferRepository.findTransfersFromDate(fromDate, 1000, 0);

    // Obtenemos cuit únicos (companyId)
    const companyIdsSet = new Set(transfers.map(t => t.companyId));
    const companyIds = Array.from(companyIdsSet);

    // Para paginación:
    const paginatedIds = companyIds.slice(offset, offset + limit);

    // Buscamos empresas por CUIT que existan
    const companies = [];
    for (const cuit of paginatedIds) {
      const c = await this.companyRepository.findByCuit(cuit);
      if (c) companies.push(c);
    }

    return companies;
  }
}

module.exports = TransferService;