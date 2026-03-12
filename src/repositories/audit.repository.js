import { decodeCursor, toPage } from "../common/pagination.js";

export class AuditRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create(data) {
    return this.prisma.auditLog.create({
      data,
      include: { user: { select: { id: true, email: true, role: true } } },
    });
  }

  findByUser(userId) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  findAllPage(where, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.auditLog
      .findMany({
        where,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { user: { select: { id: true, email: true, role: true } } },
      })
      .then((rows) => toPage(rows, limit));
  }
}
