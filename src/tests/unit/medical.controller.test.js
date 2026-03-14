import { describe, it, expect, vi, beforeEach } from "vitest";
import { MedicalController } from "../../controllers/medical.controller.js";

describe("MedicalController", () => {
  let medicalService;
  let controller;

  beforeEach(() => {
    medicalService = {
      getRecordsPage: vi.fn(),
      getRecordById: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecord: vi.fn(),
      getSignedUrl: vi.fn(),
      addFileReference: vi.fn(),
    };
    controller = new MedicalController(medicalService);
  });

  it("getAllRecords passes memberId from query", async () => {
    medicalService.getRecordsPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const memberId = "00000000-0000-4000-8000-000000000001";
    await controller.getAllRecords({ query: { memberId, limit: 20 } }, { status, locals: { requestId: "t" } }, vi.fn());
    expect(medicalService.getRecordsPage).toHaveBeenCalledWith(memberId, { cursor: undefined, limit: 20 });
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

  it("updateRecord delegates", async () => {
    const id = "00000000-0000-4000-8000-000000000002";
    medicalService.updateRecord.mockResolvedValue({ id, diagnosis: "Y" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.updateRecord({ params: { id }, body: { diagnosis: "Y" } }, { status }, vi.fn());
    expect(medicalService.updateRecord).toHaveBeenCalledWith(id, { diagnosis: "Y" });
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

  it("getSignedUrl delegates", async () => {
    const id = "00000000-0000-4000-8000-000000000002";
    medicalService.getSignedUrl.mockResolvedValue({ url: "https://x" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getSignedUrl({ params: { id }, query: { objectKey: "k" } }, { status }, vi.fn());
    expect(medicalService.getSignedUrl).toHaveBeenCalledWith(id, "k");
  });

  it("addFileReference delegates", async () => {
    const id = "00000000-0000-4000-8000-000000000002";
    medicalService.addFileReference.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.addFileReference({ params: { id }, body: { fileUrl: "https://f" } }, { status }, vi.fn());
    expect(medicalService.addFileReference).toHaveBeenCalledWith(id, "https://f");
  });
});
