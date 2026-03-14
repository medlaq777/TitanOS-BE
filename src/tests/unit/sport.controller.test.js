import { describe, it, expect, vi, beforeEach } from "vitest";
import { SportController } from "../../controllers/sport.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const memberId = "550e8400-e29b-41d4-a716-446655440001";

function mockRes() {
  const json = vi.fn();
  const send = vi.fn();
  const status = vi.fn().mockReturnValue({ json, send });
  return { json, send, status, locals: { requestId: "test" } };
}

describe("SportController", () => {
  let sportService;
  let controller;

  beforeEach(() => {
    sportService = {
      getTeamsPage: vi.fn(),
      getTeamById: vi.fn(),
      createTeam: vi.fn(),
      updateTeam: vi.fn(),
      deleteTeam: vi.fn(),
      getMembersPage: vi.fn(),
      getMemberById: vi.fn(),
      createMember: vi.fn(),
      updateMember: vi.fn(),
      deleteMember: vi.fn(),
      linkMemberToTeam: vi.fn(),
      unlinkMemberFromTeam: vi.fn(),
      getSessionsPage: vi.fn(),
      getSessionById: vi.fn(),
      createSession: vi.fn(),
      updateSession: vi.fn(),
      deleteSession: vi.fn(),
      addParticipant: vi.fn(),
      removeParticipant: vi.fn(),
      getPerformancesByMember: vi.fn(),
      getPerformanceById: vi.fn(),
      createPerformance: vi.fn(),
      updatePerformance: vi.fn(),
      deletePerformance: vi.fn(),
      getPerformancesBySession: vi.fn(),
      getPlayerStats: vi.fn(),
    };
    controller = new SportController(sportService);
  });

  it("getAllTeams", async () => {
    sportService.getTeamsPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getAllTeams({ query: { limit: 20 } }, res, vi.fn());
    expect(sportService.getTeamsPage).toHaveBeenCalledWith({ cursor: undefined, limit: 20 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, meta: expect.any(Object) }));
  });

  it("getTeamById", async () => {
    sportService.getTeamById.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.getTeamById({ params: { id } }, { status }, vi.fn());
    expect(sportService.getTeamById).toHaveBeenCalledWith(id);
    expect(status).toHaveBeenCalledWith(200);
  });

  it("createTeam returns 201", async () => {
    sportService.createTeam.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.createTeam({ body: { name: "A", sport: "s" } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("updateTeam", async () => {
    sportService.updateTeam.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.updateTeam({ params: { id }, body: { name: "B" } }, { status }, vi.fn());
    expect(sportService.updateTeam).toHaveBeenCalledWith(id, { name: "B" });
  });

  it("deleteTeam returns 204", async () => {
    sportService.deleteTeam.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteTeam({ params: { id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("getAllMembers", async () => {
    sportService.getMembersPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getAllMembers({ query: { teamId: id, limit: 20 } }, res, vi.fn());
    expect(sportService.getMembersPage).toHaveBeenCalledWith(id, { cursor: undefined, limit: 20 });
  });

  it("getMemberById", async () => {
    sportService.getMemberById.mockResolvedValue({ id: memberId });
    const { status } = mockRes();
    await controller.getMemberById({ params: { id: memberId } }, { status }, vi.fn());
    expect(sportService.getMemberById).toHaveBeenCalledWith(memberId);
  });

  it("createMember returns 201", async () => {
    sportService.createMember.mockResolvedValue({ id: memberId });
    const { status } = mockRes();
    await controller.createMember({ body: { userId: id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("updateMember", async () => {
    sportService.updateMember.mockResolvedValue({ id: memberId });
    const { status } = mockRes();
    await controller.updateMember({ params: { id: memberId }, body: {} }, { status }, vi.fn());
    expect(sportService.updateMember).toHaveBeenCalledWith(memberId, {});
  });

  it("deleteMember returns 204", async () => {
    sportService.deleteMember.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteMember({ params: { id: memberId } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("linkMemberToTeam", async () => {
    sportService.linkMemberToTeam.mockResolvedValue({});
    const { status } = mockRes();
    await controller.linkMemberToTeam({ params: { id: memberId }, body: { teamId: id } }, { status }, vi.fn());
    expect(sportService.linkMemberToTeam).toHaveBeenCalledWith(memberId, id);
  });

  it("unlinkMemberFromTeam", async () => {
    sportService.unlinkMemberFromTeam.mockResolvedValue({});
    const { status } = mockRes();
    await controller.unlinkMemberFromTeam({ params: { id: memberId } }, { status }, vi.fn());
    expect(sportService.unlinkMemberFromTeam).toHaveBeenCalledWith(memberId);
  });

  it("getAllSessions", async () => {
    sportService.getSessionsPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getAllSessions({ query: { teamId: id, from: "a", to: "b", limit: 20 } }, res, vi.fn());
    expect(sportService.getSessionsPage).toHaveBeenCalledWith(id, "a", "b", { cursor: undefined, limit: 20 });
  });

  it("getSessionById", async () => {
    sportService.getSessionById.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.getSessionById({ params: { id } }, { status }, vi.fn());
    expect(sportService.getSessionById).toHaveBeenCalledWith(id);
  });

  it("createSession returns 201", async () => {
    sportService.createSession.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.createSession({ body: { title: "t" } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("updateSession", async () => {
    sportService.updateSession.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.updateSession({ params: { id }, body: {} }, { status }, vi.fn());
    expect(sportService.updateSession).toHaveBeenCalledWith(id, {});
  });

  it("deleteSession returns 204", async () => {
    sportService.deleteSession.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteSession({ params: { id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("addParticipant returns 204", async () => {
    sportService.addParticipant.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.addParticipant({ params: { id }, body: { memberId } }, { status }, vi.fn());
    expect(sportService.addParticipant).toHaveBeenCalledWith(id, memberId);
    expect(status).toHaveBeenCalledWith(204);
  });

  it("removeParticipant returns 204", async () => {
    sportService.removeParticipant.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.removeParticipant({ params: { id, memberId } }, { status }, vi.fn());
    expect(sportService.removeParticipant).toHaveBeenCalledWith(id, memberId);
    expect(status).toHaveBeenCalledWith(204);
  });

  it("getPerformancesByMember", async () => {
    sportService.getPerformancesByMember.mockResolvedValue([]);
    const { status } = mockRes();
    await controller.getPerformancesByMember({ params: { memberId } }, { status }, vi.fn());
    expect(sportService.getPerformancesByMember).toHaveBeenCalledWith(memberId);
  });

  it("getPerformanceById", async () => {
    sportService.getPerformanceById.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.getPerformanceById({ params: { id } }, { status }, vi.fn());
    expect(sportService.getPerformanceById).toHaveBeenCalledWith(id);
  });

  it("createPerformance returns 201", async () => {
    sportService.createPerformance.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.createPerformance({ body: { memberId } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("updatePerformance", async () => {
    sportService.updatePerformance.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.updatePerformance({ params: { id }, body: {} }, { status }, vi.fn());
    expect(sportService.updatePerformance).toHaveBeenCalledWith(id, {});
  });

  it("deletePerformance returns 204", async () => {
    sportService.deletePerformance.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deletePerformance({ params: { id } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("getPerformancesBySession", async () => {
    sportService.getPerformancesBySession.mockResolvedValue([]);
    const { status } = mockRes();
    await controller.getPerformancesBySession({ params: { id } }, { status }, vi.fn());
    expect(sportService.getPerformancesBySession).toHaveBeenCalledWith(id);
  });

  it("getPlayerStats", async () => {
    sportService.getPlayerStats.mockResolvedValue({ _count: { id: 0 } });
    const { status } = mockRes();
    await controller.getPlayerStats({ params: { memberId } }, { status }, vi.fn());
    expect(sportService.getPlayerStats).toHaveBeenCalledWith(memberId);
  });
});
