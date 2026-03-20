/// <reference types="vite/client" />

declare module "*?binary" {
  const value: Uint8Array<ArrayBuffer>;
  export default value;
}
