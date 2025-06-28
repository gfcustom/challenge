class ICompanyRepository {
  /**
   * @param {Company} company
   * @returns {Promise<Company>}
   */
  async save(company) {
    throw new Error("Not implemented");
  }

  /**
   * @param {string} cuit
   * @returns {Promise<Company|null>}
   */
  async findByCuit(cuit) {
    throw new Error("Not implemented");
  }

  /**
   * Retorna empresas que se adhirieron en el último mes
   * @param {Date} fromFecha - fecha desde la cual filtrar
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Company[]>}
   */
  async findAdheredLastMonth(fromFecha, limit, offset) {
    throw new Error("Not implemented");
  }
}

module.exports = ICompanyRepository;