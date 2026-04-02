import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { FanController } from "../../controllers/fan.controller.js";

const id = "550e8400-e29b-41d4-a716-446655440000";
const matchId = "550e8400-e29b-41d4-a716-446655440001";
const userId = "550e8400-e29b-41d4-a716-446655440002";

function mockRes() {
  const json = jest.fn();
  const send = jest.fn();
  const status = jest.fn().mockReturnValue({ json, send });
  return { json, send, status, locals: { requestId: "test" } };
}

describe("FanController", () => {
  let fanService;
  let controller;

  beforeEach(() => {
    fanService = {
      createMatch: jest.fn(),
      getMatchesPage: jest.fn(),
      getMatchById: jest.fn(),
      updateMatch: jest.fn(),
      deleteMatch: jest.fn(),
      addMatchEvent: jest.fn(),
      getMatchTimeline: jest.fn(),
      updateMatchEvent: jest.fn(),
      deleteMatchEvent: jest.fn(),
      createFanAction: jest.fn(),
      getFanActionsByMatchPage: jest.fn(),
      getMyActionsPage: jest.fn(),
      getMatchVotes: jest.fn(),
      createArticle: jest.fn(),
      getArticlesPage: jest.fn(),
      getArticleById: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    };
    controller = new FanController(fanService);
  });

  it("createMatch returns 201", async () => {
    fanService.createMatch.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.createMatch({ body: {} }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getAllMatches passes status query", async () => {
    fanService.getMatchesPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getAllMatches({ query: { status: "LIVE", limit: 20 } }, res, jest.fn());
    expect(fanService.getMatchesPage).toHaveBeenCalledWith("LIVE", { cursor: undefined, limit: 20 });
  });

  it("getMatchById", async () => {
    fanService.getMatchById.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.getMatchById({ params: { id } }, { status }, jest.fn());
    expect(fanService.getMatchById).toHaveBeenCalledWith(id);
  });

  it("updateMatch", async () => {
    fanService.updateMatch.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.updateMatch({ params: { id }, body: { homeScore: 1 } }, { status }, jest.fn());
    expect(fanService.updateMatch).toHaveBeenCalledWith(id, { homeScore: 1 });
  });

  it("deleteMatch returns 204", async () => {
    fanService.deleteMatch.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteMatch({ params: { id } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("addMatchEvent returns 201", async () => {
    fanService.addMatchEvent.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.addMatchEvent({ body: { matchId } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getMatchTimeline", async () => {
    fanService.getMatchTimeline.mockResolvedValue([]);
    const { status } = mockRes();
    await controller.getMatchTimeline({ params: { matchId } }, { status }, jest.fn());
    expect(fanService.getMatchTimeline).toHaveBeenCalledWith(matchId);
  });

  it("updateMatchEvent", async () => {
    fanService.updateMatchEvent.mockResolvedValue({ id, minute: 45 });
    const { status } = mockRes();
    await controller.updateMatchEvent({ params: { id }, body: { minute: 45 } }, { status }, jest.fn());
    expect(fanService.updateMatchEvent).toHaveBeenCalledWith(id, { minute: 45 });
  });

  it("deleteMatchEvent returns 204", async () => {
    fanService.deleteMatchEvent.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteMatchEvent({ params: { id } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(204);
  });

  it("createFanAction returns 201", async () => {
    fanService.createFanAction.mockResolvedValue({ id: "a1" });
    const { status } = mockRes();
    await controller.createFanAction({ body: { type: "LIKE" }, user: { id: userId } }, { status }, jest.fn());
    expect(fanService.createFanAction).toHaveBeenCalledWith({ type: "LIKE" }, userId);
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getFanActionsByMatch", async () => {
    fanService.getFanActionsByMatchPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getFanActionsByMatch({ params: { matchId }, query: { limit: 20 } }, res, jest.fn());
    expect(fanService.getFanActionsByMatchPage).toHaveBeenCalledWith(matchId, { cursor: undefined, limit: 20 });
  });

  it("getMyActions", async () => {
    fanService.getMyActionsPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getMyActions({ user: { id: userId }, query: { limit: 20 } }, res, jest.fn());
    expect(fanService.getMyActionsPage).toHaveBeenCalledWith(userId, { cursor: undefined, limit: 20 });
  });

  it("getMatchVotes", async () => {
    fanService.getMatchVotes.mockResolvedValue({ matchId, votes: 0 });
    const { status } = mockRes();
    await controller.getMatchVotes({ params: { matchId } }, { status }, jest.fn());
    expect(fanService.getMatchVotes).toHaveBeenCalledWith(matchId);
  });

  it("createArticle returns 201", async () => {
    fanService.createArticle.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.createArticle({ body: { title: "t", content: "c" }, user: { id: userId } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(201);
  });

  it("getAllArticles", async () => {
    fanService.getArticlesPage.mockResolvedValue({ items: [], nextCursor: null, hasMore: false });
    const res = mockRes();
    await controller.getAllArticles({ query: { status: "PUBLISHED", limit: 20 } }, res, jest.fn());
    expect(fanService.getArticlesPage).toHaveBeenCalledWith("PUBLISHED", { cursor: undefined, limit: 20 });
  });

  it("getArticleById", async () => {
    fanService.getArticleById.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.getArticleById({ params: { id } }, { status }, jest.fn());
    expect(fanService.getArticleById).toHaveBeenCalledWith(id);
  });

  it("updateArticle", async () => {
    fanService.updateArticle.mockResolvedValue({ id });
    const { status } = mockRes();
    await controller.updateArticle({ params: { id }, body: { title: "x" } }, { status }, jest.fn());
    expect(fanService.updateArticle).toHaveBeenCalledWith(id, { title: "x" });
  });

  it("deleteArticle returns 204", async () => {
    fanService.deleteArticle.mockResolvedValue(undefined);
    const { status } = mockRes();
    await controller.deleteArticle({ params: { id } }, { status }, jest.fn());
    expect(status).toHaveBeenCalledWith(204);
  });
});
