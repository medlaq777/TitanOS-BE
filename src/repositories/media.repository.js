import { decodeCursor, toPage } from "../common/pagination.js";

export class MediaRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create(data) {
    return this.prisma.media.create({
      data,
      include: { owner: { select: { id: true, email: true } } },
    });
  }

  findById(id) {
    return this.prisma.media.findUnique({
      where: { id },
      include: { owner: { select: { id: true, email: true } } },
    });
  }

  findByObjectKey(objectKey) {
    return this.prisma.media.findUnique({ where: { objectKey } });
  }

  findAllByOwnerPage(ownerId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.media
      .findMany({
        where: { ownerId },
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { owner: { select: { id: true, email: true } } },
      })
      .then((rows) => toPage(rows, limit));
  }

  findAllByTeamPage(teamId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.media
      .findMany({
        where: { teamId },
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { owner: { select: { id: true, email: true } } },
      })
      .then((rows) => toPage(rows, limit));
  }

  findAllPage(where, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.media
      .findMany({
        where,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { owner: { select: { id: true, email: true } } },
      })
      .then((rows) => toPage(rows, limit));
  }

  deleteById(id) {
    return this.prisma.media.delete({ where: { id } });
  }
}
