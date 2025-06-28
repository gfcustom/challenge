const mongoose = require("mongoose");
const ITransferRepository = require("../../domain/repositories/ITransferRepository");
const Transfer = require("../../domain/entities/Transfer");

const transferSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  companyId: { type: String, required: true, index: true },
  debitAccount: { type: String, required: true },
  creditAccount: { type: String, required: true },
  date: { type: Date, required: true, index: true },
});

const TransferModel = mongoose.model("Transfer", transferSchema);

class MongoTransferRepository extends ITransferRepository {
  async save(transfer) {
    const created = await TransferModel.create({
      amount: transfer.amount,
      companyId: transfer.companyId,
      debitAccount: transfer.debitAccount,
      creditAccount: transfer.creditAccount,
      date: transfer.date,
    });
    return new Transfer(created.toObject());
  }

  async findTransfersFromDate(fromFecha, limit = 100, offset = 0) {
    return TransferModel.find({ date: { $gte: fromFecha } })
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit)
      .exec()
      .then(docs => docs.map(d => new Transfer(d.toObject())));
  }
}

module.exports = MongoTransferRepository;