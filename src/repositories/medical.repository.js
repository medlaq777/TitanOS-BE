import { decodeCursor, toPage } from "../common/pagination.js";

export class MedicalRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findRecordsPage(memberId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.medicalRecord
      .findMany({
        where: memberId ? { memberId } : undefined,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ recordedAt: "desc" }, { id: "desc" }],
        include: { member: { select: { id: true, firstName: true, lastName: true } } },
      })
      .then((rows) => toPage(rows, limit));
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
