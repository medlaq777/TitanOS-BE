import { describe, it, expect, vi, beforeEach } from "vitest";
import { MedicalController } from "../../controllers/medical.controller.js";

describe("MedicalController", () => {
  let medicalService;
  let controller;

  beforeEach(() => {
    medicalService = {
      getAllRecords: vi.fn(),
      getRecordById: vi.fn(),
      createRecord: vi.fn(),
      deleteRecord: vi.fn(),
    };
    controller = new MedicalController(medicalService);
  });

  it("getAllRecords passes memberId from query", async () => {
    medicalService.getAllRecords.mockResolvedValue([]);
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const memberId = "00000000-0000-4000-8000-000000000001";
    await controller.getAllRecords({ query: { memberId } }, { status }, vi.fn());
    expect(medicalService.getAllRecords).toHaveBeenCalledWith(memberId);
    expect(status).toHaveBeenCalledWith(200);
  });

  it("getRecordById delegates to service", async () => {
    const id = "00000000-0000-4000-8000-000000000002";
    medicalService.getRecordById.mockResolvedValue({ id, diagnosis: "X" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getRecordById({ params: { id } }, { status }, vi.fn());
    expect(medicalService.getRecordById).toHaveBeenCalledWith(id);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it("createRecord returns 201", async () => {
    const body = {
      memberId: "00000000-0000-4000-8000-000000000001",
      diagnosis: "Strain",
      recordedAt: "2024-01-15T12:00:00.000Z",
      createdBy: "Dr.",
    };
    medicalService.createRecord.mockResolvedValue({ id: "r1", ...body });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.createRecord({ body }, { status }, vi.fn());
    expect(medicalService.createRecord).toHaveBeenCalledWith(body);
    expect(status).toHaveBeenCalledWith(201);
  });

  it("deleteRecord returns 204", async () => {
    medicalService.deleteRecord.mockResolvedValue(undefined);
    const send = vi.fn();
    const status = vi.fn().mockReturnValue({ send });
    const id = "00000000-0000-4000-8000-000000000002";
    await controller.deleteRecord({ params: { id } }, { status }, vi.fn());
    expect(medicalService.deleteRecord).toHaveBeenCalledWith(id);
    expect(status).toHaveBeenCalledWith(204);
  });
});
