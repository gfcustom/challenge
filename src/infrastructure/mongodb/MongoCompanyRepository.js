const mongoose = require("mongoose");
const ICompanyRepository = require("../../domain/repositories/ICompanyRepository");
const Company = require("../../domain/entities/Company");

const companySchema = new mongoose.Schema({
  cuit: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  adhesionDate: { type: Date, required: true, index: true },
});
const CompanyModel = mongoose.model("Company", companySchema);

class MongoCompanyRepository extends ICompanyRepository {
  async save(company) {
    const created = await CompanyModel.create({
      cuit: company.cuit,
      name: company.name,
      adhesionDate: company.adhesionDate,
    });
    return new Company(created.toObject());
  }

  async findByCuit(cuit) {
    const found = await CompanyModel.findOne({ cuit });
    if (!found) return null;
    return new Company(found.toObject());
  }

  async findAdheredLastMonth(fromFecha, limit = 10, offset = 0) {
    const founds = await CompanyModel.find({ adhesionDate: { $gte: fromFecha } })
      .sort({ adhesionDate: -1 })
      .skip(offset)
      .limit(limit);
    return founds.map(c => new Company(c.toObject()));
  }
}

module.exports = MongoCompanyRepository;