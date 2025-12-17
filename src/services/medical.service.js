import { Client } from 'minio';
import { NotFoundError } from '../common/errors.js';
import { validate } from '../common/validate.js';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from '../schemas/medical.schemas.js';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

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

  async getSignedUrl(id, objectKey) {
    await this.getRecordById(id);
    const bucket = process.env.MINIO_BUCKET || 'titanos';
    const url = await minioClient.presignedGetObject(bucket, objectKey, 15 * 60);
    return { url, expiresIn: 900 };
  }

  async addFileReference(id, fileUrl) {
    await this.getRecordById(id);
    return this.medicalRepository.addFileReference(id, fileUrl);
  }
}
