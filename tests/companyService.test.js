const CompanyService = require("../src/application/CompanyService");

describe("CompanyService", () => {
  let companyRepositoryMock;
  let companyService;

  beforeEach(() => {
    companyRepositoryMock = {
      findByCuit: jest.fn(),
      save: jest.fn()
    };

    companyService = new CompanyService(companyRepositoryMock);
  });

  test("Debe lanzar error en CUIT inválido", async () => {
    await expect(companyService.adhereCompany({
      cuit: "123",
      name: "Empresa XYZ",
      adhesionDate: new Date().toISOString()
    })).rejects.toThrow("CUIT inválido");
  });

  test("Debe lanzar error si empresa ya existe", async () => {
    companyRepositoryMock.findByCuit.mockResolvedValue({ cuit: "20-12345678-9" });

    await expect(companyService.adhereCompany({
      cuit: "20-12345678-9",
      name: "Empresa XYZ",
      adhesionDate: new Date().toISOString()
    })).rejects.toThrow("Empresa con CUIT ya existe");
  });

  test("Debe guardar empresa correctamente", async () => {
    companyRepositoryMock.findByCuit.mockResolvedValue(null);
    companyRepositoryMock.save.mockImplementation(company => Promise.resolve(company));

    const company = await companyService.adhereCompany({
      cuit: "20-12345678-9",
      name: "Empresa XYZ",
      adhesionDate: new Date().toISOString()
    });

    expect(company.cuit).toBe("20-12345678-9");
    expect(company.name).toBe("Empresa XYZ");
  });
});