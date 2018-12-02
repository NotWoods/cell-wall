import { config } from "dotenv";
config();
import app, { port, env } from "./app";

export default app.listen(port, () => {
  console.log("  App is running at http://localhost:%d in %s mode", port, env);
  console.log("  Press CTRL-C to stop\n");
});
