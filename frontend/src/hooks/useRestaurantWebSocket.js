import { useEffect, useRef } from 'react';

export const useRestaurantWebSocket = (restaurantId, onNewOrder) => {
  const wsRef = useRef(null);

  useEffect(() => {
    console.log("useRestaurantWebSocket: restaurantId =", restaurantId);
    if (!restaurantId) {
      console.log("No restaurantId provided, skipping WebSocket connection");
      return;
    }

    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Restaurant WebSocket Connected');
      // Authenticate the connection
      const authMessage = { 
        type: 'AUTH', 
        role: 'restaurant',
        restaurantId 
      };
      console.log('Sending auth message:', authMessage);
      ws.send(JSON.stringify(authMessage));
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ORDER') {
        console.log('New order received, calling onNewOrder');
        onNewOrder(data);
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
      console.log('Cleaning up WebSocket connection');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [restaurantId, onNewOrder]);

  return wsRef.current;
};