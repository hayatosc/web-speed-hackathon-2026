import { gzip } from "pako";

export class HttpError extends Error {
  readonly responseJSON: unknown;

  constructor(status: number, responseJSON: unknown, url: string) {
    super(`HTTP ${status} from ${url}`);
    this.responseJSON = responseJSON;
  }
}

async function throwIfNotOk(res: Response, url: string): Promise<void> {
  if (res.ok) return;
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // response body が JSON でない場合は null のまま
  }
  throw new HttpError(res.status, body, url);
}

export async function fetchBinary(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  await throwIfNotOk(res, url);
  return res.arrayBuffer();
}

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  await throwIfNotOk(res, url);
  return res.json() as Promise<T>;
}

export async function sendFile<T>(url: string, file: File): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });
  await throwIfNotOk(res, url);
  return res.json() as Promise<T>;
}

export async function sendJSON<T>(url: string, data: object): Promise<T> {
  const jsonString = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(jsonString);
  const compressed = gzip(uint8Array);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Encoding": "gzip",
      "Content-Type": "application/json",
    },
    body: compressed,
  });
  await throwIfNotOk(res, url);
  return res.json() as Promise<T>;
}
