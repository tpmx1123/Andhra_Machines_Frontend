import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

let stompClient = null;

export const useWebSocket = (onPriceUpdate, onOrderStatusUpdate) => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const onPriceUpdateRef = useRef(onPriceUpdate);
  const onOrderStatusUpdateRef = useRef(onOrderStatusUpdate);

  // Keep refs updated
  useEffect(() => {
    onPriceUpdateRef.current = onPriceUpdate;
    onOrderStatusUpdateRef.current = onOrderStatusUpdate;
  }, [onPriceUpdate, onOrderStatusUpdate]);

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        setConnected(false);
      }
      return;
    }

    // Get API base URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    // For WebSocket, use ws:// or wss:// protocol
    const wsProtocol = apiBaseUrl.startsWith('https') ? 'https' : 'http';
    const wsUrl = apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    // SockJS will handle the protocol conversion
    const wsEndpoint = `${wsProtocol}://${wsUrl}/ws`;

    // Create SockJS connection
    const socket = new SockJS(wsEndpoint);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);
        console.log('WebSocket connected');

        // Subscribe to price updates (broadcast to all)
        client.subscribe('/topic/price-updates', (message) => {
          try {
            const priceUpdate = JSON.parse(message.body);
            if (onPriceUpdateRef.current) {
              onPriceUpdateRef.current(priceUpdate);
            }
          } catch (error) {
            console.error('Error parsing price update:', error);
          }
        });

        // Subscribe to user-specific order updates
        // Note: Spring STOMP uses /user/{username}/queue/{destination} pattern
        // We need to use the user ID as the username
        if (user && user.id) {
          const userDestination = `/user/${user.id}/queue/order-updates`;
          client.subscribe(userDestination, (message) => {
            try {
              const orderUpdate = JSON.parse(message.body);
              if (onOrderStatusUpdateRef.current) {
                onOrderStatusUpdateRef.current(orderUpdate);
              }
            } catch (error) {
              console.error('Error parsing order update:', error);
            }
          });
        }
      },
      onDisconnect: () => {
        setConnected(false);
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setConnected(false);
      },
    });

    client.activate();
    stompClient = client;

    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
      setConnected(false);
    };
  }, [user]);

  return { connected };
};

