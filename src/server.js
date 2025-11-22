import app from "./app.js";
import prisma from "./config/db.js";
import { notFoundHandler, errorHandler } from "./middlewares/globalHandlers.js";

const PORT = process.env.PORT ?? 3001;

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close();
});
