import { initializeSequelize } from "./sequelize";
import app, { injectWebSocket } from "./app";

await initializeSequelize();

export { injectWebSocket };
export default app;
