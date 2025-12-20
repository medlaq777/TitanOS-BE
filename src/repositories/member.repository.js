export class MemberRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findById(id) {
    return this.prisma.member.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, type: true },
    });
  }

  findAll() {
    return this.prisma.member.findMany({
      select: { id: true, firstName: true, lastName: true, type: true },
      orderBy: { lastName: 'asc' },
    });
  }
}
