export class FanRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createMatch(data) {
    return this.prisma.match.create({
      data,
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
    });
  }

  findAllMatches(filters = {}) {
    return this.prisma.match.findMany({
      where: filters,
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
        events: { orderBy: { minute: 'asc' } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  findMatchById(id) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
        events: { orderBy: { minute: 'asc' } },
        fanActions: true,
      },
    });
  }

  updateMatch(id, data) {
    return this.prisma.match.update({
      where: { id },
      data,
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
      },
    });
  }

  deleteMatch(id) {
    return this.prisma.match.delete({ where: { id } });
  }

  createMatchEvent(data) {
    return this.prisma.matchEvent.create({
      data,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  findMatchEventById(id) {
    return this.prisma.matchEvent.findUnique({ where: { id } });
  }

  updateMatchEvent(id, data) {
    return this.prisma.matchEvent.update({
      where: { id },
      data,
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  findEventsByMatch(matchId) {
    return this.prisma.matchEvent.findMany({
      where: { matchId },
      include: { member: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { minute: 'asc' },
    });
  }

  deleteMatchEvent(id) {
    return this.prisma.matchEvent.delete({ where: { id } });
  }

  createFanAction(data) {
    return this.prisma.fanAction.create({
      data,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  findFanActionsByMatch(matchId) {
    return this.prisma.fanAction.findMany({
      where: { matchId },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  findFanActionsByUser(userId) {
    return this.prisma.fanAction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  countVotesByMatch(matchId) {
    return this.prisma.fanAction.count({ where: { matchId, type: 'VOTE' } });
  }

  createArticle(data) {
    return this.prisma.article.create({
      data,
      include: { author: { select: { id: true, email: true } } },
    });
  }

  findAllArticles(status) {
    return this.prisma.article.findMany({
      where: status ? { status } : undefined,
      include: { author: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findArticleById(id) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { author: { select: { id: true, email: true } } },
    });
  }

  updateArticle(id, data) {
    return this.prisma.article.update({ where: { id }, data });
  }

  deleteArticle(id) {
    return this.prisma.article.delete({ where: { id } });
  }
}
