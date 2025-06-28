class Company {
  /**
   * @param {Object} props
   * @param {string} props.cuit - Número CUIT formateado
   * @param {string} props.name - Razón social
   * @param {Date} props.adhesionDate
   */
  constructor({ cuit, name, adhesionDate }) {
    this.cuit = cuit;
    this.name = name;
    this.adhesionDate = adhesionDate;
  }
}

module.exports = Company;