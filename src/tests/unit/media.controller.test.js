import { describe, it, expect, vi, beforeEach } from "vitest";
import { MediaController } from "../../controllers/media.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const teamId = "550e8400-e29b-41d4-a716-446655440001";
const userId = "550e8400-e29b-41d4-a716-446655440002";

describe("MediaController", () => {
  let mediaService;
  let controller;

  beforeEach(() => {
    mediaService = {
      uploadFile: vi.fn(),
      getAllMedia: vi.fn(),
      getMediaById: vi.fn(),
      getMediaByTeam: vi.fn(),
      getPresignedUrl: vi.fn(),
      deleteMedia: vi.fn(),
    };
    controller = new MediaController(mediaService);
  });

  it("uploadFile returns 201 when file present", async () => {
    const file = { buffer: Buffer.from("x"), originalname: "a.png", mimetype: "image/png", size: 1 };
    mediaService.uploadFile.mockResolvedValue({ id: "m1" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.uploadFile(
      { file, body: { type: "IMAGE" }, user: { id: userId } },
      { status },
      vi.fn(),
    );
    expect(mediaService.uploadFile).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(201);
  });

  it("uploadFile passes ValidationError to next when no file", async () => {
    const next = vi.fn();
    await controller.uploadFile({ body: {}, user: { id: userId } }, { status: vi.fn() }, next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toMatch(/No file provided/);
  });

  it("getAllMedia passes user id and role", async () => {
    mediaService.getAllMedia.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getAllMedia(
      { user: { id: userId, role: "PLAYER" }, query: { limit: 20 } },
      { status, locals: { requestId: "t" } },
      vi.fn(),
    );
    expect(mediaService.getAllMedia).toHaveBeenCalledWith(userId, "PLAYER", { cursor: undefined, limit: 20 });
  });

  it("getMediaById delegates", async () => {
    mediaService.getMediaById.mockResolvedValue({ id });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getMediaById({ params: { id }, user: { id: userId, role: "ADMIN" } }, { status }, vi.fn());
    expect(mediaService.getMediaById).toHaveBeenCalledWith(id, userId, "ADMIN");
  });

  it("getMediaByTeam delegates", async () => {
    mediaService.getMediaByTeam.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getMediaByTeam({ params: { teamId }, query: { limit: 20 } }, { status, locals: { requestId: "t" } }, vi.fn());
    expect(mediaService.getMediaByTeam).toHaveBeenCalledWith(teamId, { cursor: undefined, limit: 20 });
  });

  it("getPresignedUrl delegates", async () => {
    mediaService.getPresignedUrl.mockResolvedValue({ url: "http://minio/x" });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.getPresignedUrl(
      { params: { id }, query: { expirySeconds: 900 }, user: { id: userId, role: "PLAYER" } },
      { status },
      vi.fn(),
    );
    expect(mediaService.getPresignedUrl).toHaveBeenCalledWith(id, { expirySeconds: 900 }, userId, "PLAYER");
  });

  it("deleteMedia returns 204", async () => {
    mediaService.deleteMedia.mockResolvedValue(undefined);
    const send = vi.fn();
    const status = vi.fn().mockReturnValue({ send });
    await controller.deleteMedia({ params: { id }, user: { id: userId, role: "ADMIN" } }, { status }, vi.fn());
    expect(status).toHaveBeenCalledWith(204);
  });
});
