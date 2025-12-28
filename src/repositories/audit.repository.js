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
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll(filters = {}) {
    return this.prisma.auditLog.findMany({
      where: filters,
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
