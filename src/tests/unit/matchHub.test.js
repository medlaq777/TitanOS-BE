import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import WebSocket from "ws";
import { attachMatchWebSocket, broadcastToMatch } from "../../realtime/matchHub.js";
import { signAccessToken } from "../../common/jwt.js";

const MATCH_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("matchHub WebSocket", () => {
  let server;
  let wss;
  let port;

  beforeAll(() => {
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-jwt-access-secret-min-32-chars-x";
    server = http.createServer();
    wss = attachMatchWebSocket(server);
    return new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise((resolve, reject) => {
      wss.close((err) => {
        if (err) reject(err);
        else server.close(resolve);
      });
    });
  });

  it("rejects connection without token", async () => {
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
      ws.on("close", (code) => {
        expect(code).toBe(4401);
        resolve();
      });
      ws.on("error", reject);
    });
  });

  it("accepts token, subscribe, and receives broadcast payload", async () => {
    const token = signAccessToken({
      sub: "550e8400-e29b-41d4-a716-446655440001",
      email: "t@test.com",
      role: "FAN",
    });
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://127.0.0.1:${port}/ws?token=${encodeURIComponent(token)}`);
      const timeout = setTimeout(() => reject(new Error("timeout")), 5000);
      ws.on("open", () => {
        ws.send(JSON.stringify({ action: "subscribe", matchId: MATCH_ID }));
        setTimeout(() => {
          broadcastToMatch(MATCH_ID, { type: "match_update", data: { homeScore: 1 } });
        }, 30);
      });
      ws.on("message", (buf) => {
        clearTimeout(timeout);
        const msg = JSON.parse(buf.toString());
        expect(msg.type).toBe("match_update");
        expect(msg.data.homeScore).toBe(1);
        ws.close();
        resolve();
      });
      ws.on("error", (e) => {
        clearTimeout(timeout);
        reject(e);
      });
    });
  });
});
