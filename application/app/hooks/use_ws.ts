import { useEffect, useEffectEvent } from "react";

interface SharedWs {
  ws: WebSocket;
  listeners: Set<(event: MessageEvent) => void>;
}

const registry = new Map<string, SharedWs>();

function getOrCreateSharedWs(url: string): SharedWs {
  let entry = registry.get(url);
  if (!entry) {
    const ws = new WebSocket(url);
    entry = { listeners: new Set(), ws };
    registry.set(url, entry);
    ws.addEventListener("message", (event) => {
      for (const listener of entry!.listeners) {
        listener(event);
      }
    });
    ws.addEventListener("close", () => {
      registry.delete(url);
    });
  }
  return entry;
}

export function useWs<T>(url: string, onMessage: (event: T) => void) {
  const handleMessage = useEffectEvent((event: MessageEvent) => {
    onMessage(JSON.parse(event.data));
  });

  useEffect(() => {
    const entry = getOrCreateSharedWs(url);
    entry.listeners.add(handleMessage);

    return () => {
      entry.listeners.delete(handleMessage);
      if (entry.listeners.size === 0) {
        entry.ws.close();
        registry.delete(url);
      }
    };
  }, [url]);
}
