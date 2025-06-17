let ws: WebSocket | null = null;

export const getWebSocket = () => ws;

export const connectWebSocket = (url: string) => {
  ws = new WebSocket(url);
};

export const sendWebSocketMessage = (msg: string) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  } else {
    console.warn("WebSocket not connected");
  }
};
