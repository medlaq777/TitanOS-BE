export class MedicalRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllRecords(memberId) {
    return this.prisma.medicalRecord.findMany({
      where: memberId ? { memberId } : undefined,
      include: { member: true },
      orderBy: { recordedAt: 'desc' },
    });
  }

  findRecordById(id) {
    return this.prisma.medicalRecord.findUnique({ where: { id }, include: { member: true } });
  }

  createRecord(data) {
    return this.prisma.medicalRecord.create({ data, include: { member: true } });
  }

  updateRecord(id, data) {
    return this.prisma.medicalRecord.update({ where: { id }, data });
  }

  deleteRecord(id) {
    return this.prisma.medicalRecord.delete({ where: { id } });
  }
}
