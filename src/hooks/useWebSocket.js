import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

let stompClient = null;

export const useWebSocket = (onPriceUpdate, onOrderStatusUpdate, onUserUpdate) => {
  const { user, refreshUser } = useAuth();
  const [connected, setConnected] = useState(false);
  const onPriceUpdateRef = useRef(onPriceUpdate);
  const onOrderStatusUpdateRef = useRef(onOrderStatusUpdate);
  const onUserUpdateRef = useRef(onUserUpdate);

  // Keep refs updated
  useEffect(() => {
    onPriceUpdateRef.current = onPriceUpdate;
    onOrderStatusUpdateRef.current = onOrderStatusUpdate;
    onUserUpdateRef.current = onUserUpdate;
  }, [onPriceUpdate, onOrderStatusUpdate, onUserUpdate]);

  useEffect(() => {
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
        logger.log('✅ WebSocket connected successfully');
        logger.log('WebSocket endpoint:', wsEndpoint);

        // Subscribe to price updates (broadcast to all - works for authenticated and non-authenticated users)
        const subscription = client.subscribe('/topic/price-updates', (message) => {
          try {
            const priceUpdate = JSON.parse(message.body);
            logger.log('📨 WebSocket: Price update message received:', priceUpdate);
            
            if (onPriceUpdateRef.current) {
              onPriceUpdateRef.current(priceUpdate);
            } else {
              logger.warn('⚠️ WebSocket: No price update handler registered');
            }
          } catch (error) {
            logger.error('❌ Error parsing price update:', error);
            logger.error('❌ Raw message body:', message.body);
          }
        });
        
        logger.log('✅ Subscribed to /topic/price-updates');

        // Subscribe to user-specific order updates (only if user is authenticated)
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
              logger.error('Error parsing order update:', error);
            }
          });

          // Subscribe to user-specific profile updates
          const userUpdateDestination = `/user/${user.id}/queue/user-updates`;
          client.subscribe(userUpdateDestination, (message) => {
            try {
              const userUpdate = JSON.parse(message.body);
              // Refresh user data when admin updates profile
              if (refreshUser) {
                refreshUser();
              }
              if (onUserUpdateRef.current) {
                onUserUpdateRef.current(userUpdate);
              }
            } catch (error) {
              logger.error('Error parsing user update:', error);
            }
          });
        }
      },
      onDisconnect: () => {
        setConnected(false);
        logger.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        logger.error('STOMP error:', frame);
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
  }, [user, refreshUser]);

  return { connected };
};

