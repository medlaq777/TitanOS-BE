import { WebSocketServer } from "ws";
import { verifyAccessToken } from "../common/jwt.js";

const matchRooms = new Map();

function addToRoom(matchId, ws) {
  if (!matchRooms.has(matchId)) {
    matchRooms.set(matchId, new Set());
  }
  matchRooms.get(matchId).add(ws);
}

function removeFromRoom(matchId, ws) {
  matchRooms.get(matchId)?.delete(ws);
  if (matchRooms.get(matchId)?.size === 0) {
    matchRooms.delete(matchId);
  }
}

export function attachMatchWebSocket(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    try {
      const host = req.headers.host ?? "localhost";
      const url = new URL(req.url ?? "/", `http://${host}`);
      const token = url.searchParams.get("token");
      if (!token) {
        ws.close(4401, "Missing token");
        return;
      }
      verifyAccessToken(token);
    } catch {
      ws.close(4401, "Unauthorized");
      return;
    }

    const subs = new Set();

    ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (msg.action === "subscribe" && typeof msg.matchId === "string") {
        subs.add(msg.matchId);
        addToRoom(msg.matchId, ws);
      }
      if (msg.action === "unsubscribe" && typeof msg.matchId === "string") {
        subs.delete(msg.matchId);
        removeFromRoom(msg.matchId, ws);
      }
    });

    ws.on("close", () => {
      for (const mid of subs) {
        removeFromRoom(mid, ws);
      }
      subs.clear();
    });
  });

  return wss;
}

export function broadcastToMatch(matchId, message) {
  const room = matchRooms.get(matchId);
  if (!room?.size) return;
  const payload = typeof message === "string" ? message : JSON.stringify(message);
  for (const client of room) {
    if (client.readyState === 1) client.send(payload);
  }
}
