import MedicalRecord from "../models/medical-record.model.js";

class MedicalRecordRepository {
  async findById(id) {
    return MedicalRecord.findById(id).exec();
  }

  async create(data) {
    return new MedicalRecord(data).save();
  }

  async updateById(id, data, options = { new: true }) {
    return MedicalRecord.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id) {
    return MedicalRecord.findByIdAndDelete(id).exec();
  }

  async find(filter = {}) {
    return MedicalRecord.find(filter).exec();
  }
}

export default new MedicalRecordRepository();
