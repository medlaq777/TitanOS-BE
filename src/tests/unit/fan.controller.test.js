import { describe, it, expect, vi, beforeEach } from "vitest";
import { FanController } from "../../controllers/fan.controller.js";

describe("FanController", () => {
  let fanService;
  let controller;

  beforeEach(() => {
    fanService = {
      updateMatchEvent: vi.fn(),
    };
    controller = new FanController(fanService);
  });

  it("updateMatchEvent delegates to service", async () => {
    fanService.updateMatchEvent.mockResolvedValue({ id: "e1", minute: 45 });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.updateMatchEvent(
      { params: { id: "e1" }, body: { minute: 45 } },
      { status },
      vi.fn(),
    );
    expect(fanService.updateMatchEvent).toHaveBeenCalledWith("e1", { minute: 45 });
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { id: "e1", minute: 45 } }));
  });
});
