import { describe, it, expect, vi, beforeEach } from "vitest";
import { SportController } from "../../controllers/sport.controller.js";

describe("SportController", () => {
  let sportService;
  let controller;

  beforeEach(() => {
    sportService = {
      getAllTeams: vi.fn(),
      getTeamById: vi.fn(),
      createTeam: vi.fn(),
      getAllMembers: vi.fn(),
      getPlayerStats: vi.fn(),
    };
    controller = new SportController(sportService);
  });

  it("getAllTeams delegates to service", async () => {
    sportService.getAllTeams.mockResolvedValue([{ id: "t1" }]);
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getAllTeams({}, { status }, vi.fn());
    expect(sportService.getAllTeams).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: [{ id: "t1" }] }),
    );
  });

  it("getTeamById passes id from params", async () => {
    sportService.getTeamById.mockResolvedValue({ id: "t1", name: "Team" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getTeamById({ params: { id: "t1" } }, { status }, vi.fn());
    expect(sportService.getTeamById).toHaveBeenCalledWith("t1");
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it("createTeam returns 201", async () => {
    sportService.createTeam.mockResolvedValue({ id: "t1", name: "New" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.createTeam({ body: { name: "New", sport: "soccer" } }, { status }, vi.fn());
    expect(sportService.createTeam).toHaveBeenCalledWith({ name: "New", sport: "soccer" });
    expect(status).toHaveBeenCalledWith(201);
  });
});
