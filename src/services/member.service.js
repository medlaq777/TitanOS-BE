import mongoose from "mongoose";
import memberRepository from "../repositories/member.repository.js";
import medicalRecordRepository from "../repositories/medical-record.repository.js";

class MemberService {
  async updateProfile(id, data) {
    await memberRepository.updateById(id, data); return true;
  }

  async calculateOverallForm(id) {
    return 8.5; // Mock form rating out of 10
  }

  async changeContractStatus(id, newStatus) {
    await memberRepository.updateById(id, { contractStatus: newStatus }); return true;
  }

  async getMedicalClearance(id) {
    const records = await medicalRecordRepository.find({ memberId: id });
    if (!records || records.length === 0) return true;
    const latest = records.sort((a,b) => b.incidentDate - a.incidentDate)[0];
    return latest.status === 'CLEARED';
  }

  async create(data) { return memberRepository.create(data); }
  async getById(id) { return memberRepository.findById(id); }
  async update(id, data) { return memberRepository.updateById(id, data); }
  async delete(id) { return memberRepository.deleteById(id); }
}

export default new MemberService();
