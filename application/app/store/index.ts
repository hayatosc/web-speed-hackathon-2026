import { legacy_createStore as createStore } from "redux";

const rootReducer = (state = {}) => state;

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);

export function createAppStore() {
  return createStore(rootReducer);
}
