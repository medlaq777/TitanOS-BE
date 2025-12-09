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
}
