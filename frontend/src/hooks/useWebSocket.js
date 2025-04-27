import { useEffect, useRef, useCallback } from 'react';

export const useWebSocket = (userId, onOrderUpdate) => {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Authenticate the connection
      ws.send(JSON.stringify({ type: 'AUTH', userId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_UPDATE') {
        onOrderUpdate(data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId, onOrderUpdate]);

  return wsRef.current;
};