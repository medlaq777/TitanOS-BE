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
}
