import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent, paginated } from '../common/response.js';

export class MedicalController {
  constructor(medicalService) {
    this.medicalService = medicalService;
  }

  getAllRecords = asyncWrapper(async (req, res) => {
    const { memberId, cursor, limit } = req.query;
    const page = await this.medicalService.getRecordsPage(memberId, { cursor, limit });
    return paginated(res, page.items, {
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
      limit,
    });
  });

  getRecordById = asyncWrapper(async (req, res) => {
    const record = await this.medicalService.getRecordById(req.params.id);
    return success(res, record);
  });

  createRecord = asyncWrapper(async (req, res) => {
    const record = await this.medicalService.createRecord(req.body);
    return created(res, record);
  });

  updateRecord = asyncWrapper(async (req, res) => {
    const record = await this.medicalService.updateRecord(req.params.id, req.body);
    return success(res, record);
  });

  deleteRecord = asyncWrapper(async (req, res) => {
    await this.medicalService.deleteRecord(req.params.id);
    return noContent(res);
  });

  getSignedUrl = asyncWrapper(async (req, res) => {
    const result = await this.medicalService.getSignedUrl(req.params.id, req.query.objectKey);
    return success(res, result);
  });

  addFileReference = asyncWrapper(async (req, res) => {
    const record = await this.medicalService.addFileReference(req.params.id, req.body.fileUrl);
    return success(res, record);
  });
}
