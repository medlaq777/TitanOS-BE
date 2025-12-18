export class WellnessRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllForms(memberId) {
    return this.prisma.wellnessForm.findMany({
      where: memberId ? { memberId } : undefined,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { date: 'desc' },
    });
  }

  findFormById(id) {
    return this.prisma.wellnessForm.findUnique({
      where: { id },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  createForm(data) {
    return this.prisma.wellnessForm.create({
      data,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  updateForm(id, data) {
    return this.prisma.wellnessForm.update({ where: { id }, data });
  }

  deleteForm(id) {
    return this.prisma.wellnessForm.delete({ where: { id } });
  }

  findRecentByMember(memberId, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.prisma.wellnessForm.findMany({
      where: { memberId, date: { gte: since } },
      orderBy: { date: 'desc' },
    });
  }
}
