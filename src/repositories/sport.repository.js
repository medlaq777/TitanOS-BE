export class SportRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllTeams() {
    return this.prisma.team.findMany({ include: { members: true } });
  }

  findTeamById(id) {
    return this.prisma.team.findUnique({ where: { id }, include: { members: true } });
  }

  createTeam(data) {
    return this.prisma.team.create({ data });
  }

  updateTeam(id, data) {
    return this.prisma.team.update({ where: { id }, data });
  }

  deleteTeam(id) {
    return this.prisma.team.delete({ where: { id } });
  }

  findAllMembers(teamId) {
    return this.prisma.member.findMany({
      where: teamId ? { teamId } : undefined,
      include: { user: true, team: true },
    });
  }

  findMemberById(id) {
    return this.prisma.member.findUnique({ where: { id }, include: { user: true, team: true } });
  }

  createMember(data) {
    return this.prisma.member.create({ data, include: { user: true } });
  }

  updateMember(id, data) {
    return this.prisma.member.update({ where: { id }, data });
  }

  deleteMember(id) {
    return this.prisma.member.delete({ where: { id } });
  }

  findAllSessions(teamId, from, to) {
    return this.prisma.session.findMany({
      where: {
        ...(teamId && { teamId }),
        ...(from && { date: { gte: new Date(from) } }),
        ...(to && { date: { lte: new Date(to) } }),
      },
      include: { team: true, participants: { include: { member: true } } },
      orderBy: { date: 'asc' },
    });
  }

  findSessionById(id) {
    return this.prisma.session.findUnique({
      where: { id },
      include: { team: true, participants: { include: { member: true } }, performances: true },
    });
  }

  createSession(data) {
    return this.prisma.session.create({ data });
  }

  updateSession(id, data) {
    return this.prisma.session.update({ where: { id }, data });
  }

  deleteSession(id) {
    return this.prisma.session.delete({ where: { id } });
  }

  addParticipant(sessionId, memberId) {
    return this.prisma.sessionMember.create({ data: { sessionId, memberId } });
  }

  removeParticipant(sessionId, memberId) {
    return this.prisma.sessionMember.delete({
      where: { sessionId_memberId: { sessionId, memberId } },
    });
  }

  findPerformancesByMember(memberId) {
    return this.prisma.performance.findMany({
      where: { memberId },
      include: { session: true },
      orderBy: { recordedAt: 'desc' },
    });
  }

  findPerformanceById(id) {
    return this.prisma.performance.findUnique({
      where: { id },
      include: { member: true, session: true },
    });
  }

  createPerformance(data) {
    return this.prisma.performance.create({ data });
  }

  updatePerformance(id, data) {
    return this.prisma.performance.update({ where: { id }, data });
  }

  deletePerformance(id) {
    return this.prisma.performance.delete({ where: { id } });
  }

  findPerformancesBySession(sessionId) {
    return this.prisma.performance.findMany({
      where: { sessionId },
      include: { member: true },
      orderBy: { recordedAt: 'desc' },
    });
  }

  getPlayerStats(memberId) {
    return this.prisma.performance.aggregate({
      where: { memberId },
      _avg: { distance: true, speed: true, rating: true },
      _max: { distance: true, speed: true, rating: true },
      _min: { distance: true, speed: true, rating: true },
      _count: { id: true },
    });
  }
}
