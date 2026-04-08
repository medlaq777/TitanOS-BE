import app from "./app.js";
import Config from "./config/config.js";
import db from "./config/db.js";
await db.connect();

const port = Config.server.port;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

