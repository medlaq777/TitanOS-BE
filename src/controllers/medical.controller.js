import { asyncWrapper } from '../common/asyncWrapper.js';
import { success, created, noContent } from '../common/response.js';

export class MedicalController {
  constructor(medicalService) {
    this.medicalService = medicalService;
  }

  getAllRecords = asyncWrapper(async (req, res) => {
    const records = await this.medicalService.getAllRecords(req.query.memberId);
    return success(res, records);
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
}
