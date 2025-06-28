class Transfer {
  /**
   * @param {Object} props
   * @param {number} props.amount
   * @param {string} props.companyId
   * @param {string} props.debitAccount
   * @param {string} props.creditAccount
   * @param {Date} props.date
   */
  constructor({ amount, companyId, debitAccount, creditAccount, date }) {
    this.amount = amount;
    this.companyId = companyId;
    this.debitAccount = debitAccount;
    this.creditAccount = creditAccount;
    this.date = date;
  }
}

module.exports = Transfer;