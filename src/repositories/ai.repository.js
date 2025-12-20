export class AIRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createInsight(data) {
    return this.prisma.aIInsight.create({
      data,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  findAllByMember(memberId) {
    return this.prisma.aIInsight.findMany({
      where: { memberId },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { generatedAt: 'desc' },
    });
  }

  findLatestByMember(memberId) {
    return this.prisma.aIInsight.findFirst({
      where: { memberId },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { generatedAt: 'desc' },
    });
  }

  findById(id) {
    return this.prisma.aIInsight.findUnique({
      where: { id },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  deleteById(id) {
    return this.prisma.aIInsight.delete({ where: { id } });
  }
}
