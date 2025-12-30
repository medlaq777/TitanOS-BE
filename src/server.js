import app from "./app.js";
import prisma from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middlewares/globalHandlers.js";
import { attachMatchWebSocket } from "./realtime/matchHub.js";

const PORT = process.env.PORT ?? 3001;

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = attachMatchWebSocket(server);

process.on("SIGTERM", async () => {
  await new Promise((resolve) => wss.close(resolve));
  await prisma.$disconnect();
  server.close();
});
