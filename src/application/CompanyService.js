const Company = require("../domain/entities/Company");

class CompanyService {
  /**
   * 
   * @param {ICompanyRepository} companyRepository 
   */
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  /**
   * Inserta nueva empresa validando que no exista CUIT y que datos sean válidos.
   * @param {Object} companyData
   * @param {string} companyData.cuit
   * @param {string} companyData.name
   * @param {string} companyData.adhesionDate (en formato ISO)
   */
  async adhereCompany({ cuit, name, adhesionDate }) {
    // Validar CUIT: argentinian format = XX-XXXXXXXX-X (ejemplo regex básico)
    if (!/^\d{2}-\d{8}-\d{1}$/.test(cuit)) {
      throw new Error("CUIT inválido");
    }
    if (typeof name !== "string" || name.trim().length < 3) {
      throw new Error("Razón social inválida");
    }
    const dateObj = new Date(adhesionDate);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Fecha de adhesión inválida");
    }

    // Verificar que no exista empresa con ese CUIT
    const existing = await this.companyRepository.findByCuit(cuit);
    if (existing) {
      throw new Error("Empresa con CUIT ya existe");
    }

    const company = new Company({
      cuit,
      name: name.trim(),
      adhesionDate: dateObj,
    });

    return this.companyRepository.save(company);
  }

  /**
   * Trae empresas adheridas en el último mes (paginado)
   * @param {number} limit 
   * @param {number} offset
   * @returns {Promise<Company[]>}
   */
  async getCompaniesAdheredLastMonth(limit = 10, offset = 0) {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - 30);
    console.log(`Buscando empresas adheridas desde: ${fromDate.toISOString()}`);
    return this.companyRepository.findAdheredLastMonth(fromDate, limit, offset);
  }
}

module.exports = CompanyService;