import mongoose from "mongoose";
import sessionRepository from "../repositories/session.repository.js";
import sessionPerformanceRepository from "../repositories/session-performance.repository.js";

class SessionService {
  async markAttendance(id, memberId, status) {
    await sessionPerformanceRepository.updateBySessionAndMember(id, memberId, { coachNotes: `Attendance: ${status}` }); return true;
  }

  async getAttendanceStats(id) {
    const perfs = await sessionPerformanceRepository.find({ sessionId: id }); return { totalAttended: perfs.length };
  }

  async completeSession(id) {
    return true;
  }

  async create(data) { return sessionRepository.create(data); }
  async getById(id) { return sessionRepository.findById(id); }
  async update(id, data) { return sessionRepository.updateById(id, data); }
  async delete(id) { return sessionRepository.deleteById(id); }
}

export default new SessionService();
