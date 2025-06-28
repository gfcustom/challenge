const TransferService = require("../src/application/TransferService");
const Company = require("../src/domain/entities/Company");
const Transfer = require("../src/domain/entities/Transfer");

describe("TransferService - pruebas básicas sin mocks externos", () => {
  let transferRepositoryMock;
  let companyRepositoryMock;
  let transferService;

  beforeEach(() => {
    // Mock de repositorio de transferencias con funciones simuladas
    transferRepositoryMock = {
      save: jest.fn(async (transfer) => {
        return transfer;  // Simula guardar y retornar la transferencia
      }),
      findTransfersFromDate: jest.fn(async (fromDate, limit, offset) => {
        // Para pruebas, retornamos algunas transferencia simuladas filtradas
        return [
          new Transfer({
            amount: 100,
            companyId: "30-11111111-1",
            debitAccount: "123",
            creditAccount: "456",
            date: new Date()
          }),
          new Transfer({
            amount: 200,
            companyId: "30-22222222-2",
            debitAccount: "789",
            creditAccount: "012",
            date: new Date()
          })
        ];
      }),
    };

    // Mock repositorio de empresas
    companyRepositoryMock = {
      findByCuit: jest.fn(async (cuit) => {
        if (cuit === "30-11111111-1" || cuit === "30-22222222-2") {
          return new Company({
            cuit,
            name: "Empresa Test",
            adhesionDate: new Date(),
          });
        }
        return null;
      }),
      save: jest.fn(async (company) => company),
    };

    transferService = new TransferService(transferRepositoryMock, companyRepositoryMock);
  });

  test("Debe rechazar importe inválido (<=0)", async () => {
    await expect(transferService.createTransfer({
      amount: 0,
      companyId: "30-11111111-1",
      debitAccount: "123",
      creditAccount: "456",
      date: new Date().toISOString()
    })).rejects.toThrow("Importe inválido");

    await expect(transferService.createTransfer({
      amount: -100,
      companyId: "30-11111111-1",
      debitAccount: "123",
      creditAccount: "456",
      date: new Date().toISOString()
    })).rejects.toThrow("Importe inválido");
  });

  test("Debe rechazar si empresa no existe", async () => {
    companyRepositoryMock.findByCuit.mockResolvedValueOnce(null);

    await expect(transferService.createTransfer({
      amount: 100,
      companyId: "30-99999999-9",
      debitAccount: "123",
      creditAccount: "456",
      date: new Date().toISOString()
    })).rejects.toThrow("Empresa no existe para transferencia");
  });

  test("Debe crear transferencia correctamente", async () => {
    const cuit = "30-11111111-1";

    const transferData = {
      amount: 500,
      companyId: cuit,
      debitAccount: "ACCT-001",
      creditAccount: "ACCT-002",
      date: new Date().toISOString()
    };

    const result = await transferService.createTransfer(transferData);

    expect(result).toBeInstanceOf(Transfer);
    expect(result.amount).toBe(transferData.amount);
    expect(result.companyId).toBe(cuit);
    expect(result.debitAccount).toBe(transferData.debitAccount);
    expect(result.creditAccount).toBe(transferData.creditAccount);
    expect(transferRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  test("Debe retornar empresas con transferencias del último mes (paginación)", async () => {
    const result = await transferService.getCompaniesWithTransfersLastMonth(10, 0);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    // Verificar que empresa retornada tenga las propiedades principales
    expect(result[0]).toHaveProperty("cuit");
    expect(result[0]).toHaveProperty("name");
  });
});