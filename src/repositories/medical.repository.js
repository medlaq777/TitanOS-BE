export class MedicalRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllRecords(memberId) {
    return this.prisma.medicalRecord.findMany({
      where: memberId ? { memberId } : undefined,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { recordedAt: 'desc' },
    });
  }

  findRecordById(id) {
    return this.prisma.medicalRecord.findUnique({
      where: { id },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  createRecord(data) {
    return this.prisma.medicalRecord.create({
      data,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  updateRecord(id, data) {
    return this.prisma.medicalRecord.update({ where: { id }, data });
  }

  addFileReference(id, fileUrl) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data: { fileUrls: { push: fileUrl } },
    });
  }

  deleteRecord(id) {
    return this.prisma.medicalRecord.delete({ where: { id } });
  }
}
