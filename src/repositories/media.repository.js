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

  findAllByOwner(ownerId) {
    return this.prisma.media.findMany({
      where: { ownerId },
      include: { owner: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllByTeam(teamId) {
    return this.prisma.media.findMany({
      where: { teamId },
      include: { owner: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll(filters = {}) {
    return this.prisma.media.findMany({
      where: filters,
      include: { owner: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  deleteById(id) {
    return this.prisma.media.delete({ where: { id } });
  }
}
