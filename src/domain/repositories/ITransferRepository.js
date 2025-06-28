class ITransferRepository {
  /**
   * @param {Transfer} transfer
   * @returns {Promise<Transfer>}
   */
  async save(transfer) {
    throw new Error("Not implemented");
  }

  /**
   * Retorna todas las transferencias de empresa en / desde cierta fecha
   * @param {Date} fromFecha - fecha desde la cual filtrar transferencias
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<Transfer[]>}
   */
  async findTransfersFromDate(fromFecha, limit, offset) {
    throw new Error("Not implemented");
  }
}

module.exports = ITransferRepository;