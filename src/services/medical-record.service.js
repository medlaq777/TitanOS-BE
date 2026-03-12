import mongoose from "mongoose";
import medicalRecordRepository from "../repositories/medical-record.repository.js";

class MedicalRecordService {
  async updateStatus(id, newStatus) {
    await medicalRecordRepository.updateById(id, { status: newStatus }); return true;
  }

  async clearPlayerForSelection(id) {
    await medicalRecordRepository.updateById(id, { status: 'CLEARED' }); return true;
  }

  async extendRehab(id, days) {
    const rec = await medicalRecordRepository.findById(id); const newDate = new Date((rec.estimatedReturnDate || new Date()).getTime() + days * 86400000); await medicalRecordRepository.updateById(id, { estimatedReturnDate: newDate }); return true;
  }

  async create(data) { return medicalRecordRepository.create(data); }
  async getById(id) { return medicalRecordRepository.findById(id); }
  async update(id, data) { return medicalRecordRepository.updateById(id, data); }
  async delete(id) { return medicalRecordRepository.deleteById(id); }
}

export default new MedicalRecordService();
