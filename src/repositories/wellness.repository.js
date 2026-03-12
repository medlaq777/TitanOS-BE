import { decodeCursor, toPage } from "../common/pagination.js";

export class WellnessRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findFormsPage(memberId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.wellnessForm
      .findMany({
        where: memberId ? { memberId } : undefined,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ date: "desc" }, { id: "desc" }],
        include: { member: { select: { id: true, firstName: true, lastName: true } } },
      })
      .then((rows) => toPage(rows, limit));
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
      orderBy: { date: "desc" },
    });
  }
}
