import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from '../schemas/medical.schemas.js';

export class MedicalService {
  constructor(medicalRepository) {
    this.medicalRepository = medicalRepository;
  }

  getAllRecords(memberId) {
    return this.medicalRepository.findAllRecords(memberId);
  }

  async getRecordById(id) {
    const record = await this.medicalRepository.findRecordById(id);
    if (!record) throw new NotFoundError('Medical record not found');
    return record;
  }

  createRecord(body) {
    const data = validate(createMedicalRecordSchema, body);
    return this.medicalRepository.createRecord(data);
  }

  async updateRecord(id, body) {
    await this.getRecordById(id);
    const data = validate(updateMedicalRecordSchema, body);
    return this.medicalRepository.updateRecord(id, data);
  }

  async deleteRecord(id) {
    await this.getRecordById(id);
    return this.medicalRepository.deleteRecord(id);
  }
}
