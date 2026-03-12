import { decodeCursor, toPage } from "../common/pagination.js";

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

  findMatchesPage(filters, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.match
      .findMany({
        where: filters,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        include: {
          homeTeam: { select: { id: true, name: true } },
          awayTeam: { select: { id: true, name: true } },
          events: { orderBy: { minute: "asc" } },
        },
        orderBy: [{ scheduledAt: "asc" }, { id: "asc" }],
      })
      .then((rows) => toPage(rows, limit));
  }

  findMatchById(id) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
        events: { orderBy: { minute: "asc" } },
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
      orderBy: { minute: "asc" },
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

  findFanActionsByMatchPage(matchId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.fanAction
      .findMany({
        where: { matchId },
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { user: { select: { id: true, email: true } } },
      })
      .then((rows) => toPage(rows, limit));
  }

  findFanActionsByUserPage(userId, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.fanAction
      .findMany({
        where: { userId },
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      })
      .then((rows) => toPage(rows, limit));
  }

  countVotesByMatch(matchId) {
    return this.prisma.fanAction.count({ where: { matchId, type: "VOTE" } });
  }

  createArticle(data) {
    return this.prisma.article.create({
      data,
      include: { author: { select: { id: true, email: true } } },
    });
  }

  findArticlesPage(status, { cursor, limit }) {
    const take = limit + 1;
    const decoded = cursor ? decodeCursor(cursor) : null;
    return this.prisma.article
      .findMany({
        where: status ? { status } : undefined,
        take,
        skip: decoded ? 1 : 0,
        cursor: decoded ? { id: decoded.id } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: { author: { select: { id: true, email: true } } },
      })
      .then((rows) => toPage(rows, limit));
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
