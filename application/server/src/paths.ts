import path from "path";

const __dirname = import.meta.dirname;

export const PUBLIC_PATH = path.resolve(__dirname, "../../public");
export const UPLOAD_PATH = path.resolve(__dirname, "../../upload");
export const CLIENT_DIST_PATH = path.resolve(__dirname, "../../build/client");
export const SERVER_BUILD_PATH = path.resolve(__dirname, "../../build/server/index.js");
export const DATABASE_PATH = path.resolve(__dirname, "../database.sqlite");
