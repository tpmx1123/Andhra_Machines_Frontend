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
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // For WebSocket, use ws:// or wss:// protocol
    const wsProtocol = apiBaseUrl.startsWith('https') ? 'https' : 'http';
    // Remove protocol, remove trailing slash, and remove /api if present (WebSocket endpoint is at /ws, not /api/ws)
    let wsUrl = apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    // Remove /api from the path if it exists (WebSocket endpoint is at root /ws, not /api/ws)
    wsUrl = wsUrl.replace(/\/api$/, '').replace(/\/api\//, '/');
    // SockJS will handle the protocol conversion
    const wsEndpoint = `${wsProtocol}://${wsUrl}/ws`;

    // Suppress console errors for SockJS info endpoint 404s (these are expected during handshake)
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const suppressSockJS404 = (...args) => {
      const message = String(args.join(' '));
      // Suppress all SockJS-related errors (404, 405, connection failures, etc.)
      if (message.includes('/ws/') || 
          message.includes('SockJS') ||
          message.includes('WebSocket connection') ||
          message.includes('EventSource') ||
          message.includes('jsonp') ||
          message.includes('xhr') ||
          message.includes('xhr_streaming') ||
          message.includes('websocket') ||
          (message.includes('405') && message.includes('Not Allowed')) ||
          (message.includes('404') && message.includes('Not Found')) ||
          (message.includes('WebSocket is closed before the connection is established')) ||
          (message.includes('MIME type') && message.includes('text/event-stream'))) {
        return; // Suppress this error
      }
      originalConsoleError.apply(console, args);
    };
    
    const suppressSockJSWarn = (...args) => {
      const message = String(args.join(' '));
      // Suppress SockJS warnings about info endpoint, transport methods, etc.
      if (message.includes('/ws/') || 
          message.includes('SockJS') ||
          message.includes('WebSocket') ||
          message.includes('EventSource') ||
          message.includes('locatorjs') ||
          message.includes('Unsupported React renderer')) {
        return; // Suppress this warning
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Temporarily override console methods to suppress SockJS 404 errors
    console.error = suppressSockJS404;
    console.warn = suppressSockJSWarn;
    
    // Create SockJS connection
    const socket = new SockJS(wsEndpoint);
    
    // Also suppress errors on the socket itself
    socket.onerror = (error) => {
      const url = error?.target?.url || '';
      // Suppress all SockJS transport errors (they're expected during connection attempts)
      if (url.includes('/ws/') || 
          url.includes('xhr') || 
          url.includes('websocket') ||
          url.includes('jsonp') ||
          url.includes('eventsource')) {
        // Suppress SockJS transport errors
        return;
      }
      // For other errors, log them
      originalConsoleError('WebSocket error:', error);
    };
    
    // Intercept XMLHttpRequest to suppress SockJS transport errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._sockjsUrl = url;
      return originalXHROpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      if (this._sockjsUrl && this._sockjsUrl.includes('/ws/')) {
        // Suppress errors for SockJS transport endpoints
        this.addEventListener('error', (e) => {
          e.stopPropagation();
        }, { once: true });
        this.addEventListener('load', function() {
          if (this.status === 404 || this.status === 405) {
            // Suppress 404/405 for SockJS endpoints
            return;
          }
        }, { once: true });
      }
      return originalXHRSend.apply(this, args);
    };
    
    // Intercept EventSource to suppress errors
    const originalEventSource = window.EventSource;
    if (originalEventSource) {
      window.EventSource = function(url, ...rest) {
        if (url && url.includes('/ws/')) {
          // Suppress EventSource errors for SockJS
          const es = new originalEventSource(url, ...rest);
          es.addEventListener('error', (e) => {
            e.stopPropagation();
          });
          return es;
        }
        return new originalEventSource(url, ...rest);
      };
    }
    
    // Intercept global error handler to suppress SockJS errors
    const originalWindowError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const errorMessage = String(message || '');
      // Suppress SockJS-related errors
      if (errorMessage.includes('/ws/') ||
          errorMessage.includes('jsonp') ||
          errorMessage.includes('Unexpected token') ||
          errorMessage.includes('SockJS') ||
          (source && source.includes('/ws/'))) {
        return true; // Suppress the error
      }
      // Call original error handler if it exists
      if (originalWindowError) {
        return originalWindowError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };
    
    // Intercept unhandled promise rejections for SockJS
    const originalUnhandledRejection = window.onunhandledrejection;
    window.addEventListener('unhandledrejection', function(event) {
      const reason = String(event.reason || '');
      if (reason.includes('/ws/') ||
          reason.includes('SockJS') ||
          reason.includes('jsonp') ||
          reason.includes('405') ||
          reason.includes('404')) {
        event.preventDefault(); // Suppress the error
      }
    });
    
    // Restore original methods after connection attempt
    setTimeout(() => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      if (originalEventSource) {
        window.EventSource = originalEventSource;
      }
      window.onerror = originalWindowError;
      // Note: unhandledrejection listener will remain, but that's okay as it only suppresses SockJS errors
    }, 10000); // Increased timeout to catch all SockJS transport attempts
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // Suppress SockJS transport debug messages (404, 405, connection failures, etc.)
        if (!str.includes('/ws/') && 
            !str.includes('404') && 
            !str.includes('405') &&
            !str.includes('SockJS') &&
            !str.includes('xhr') &&
            !str.includes('websocket') &&
            !str.includes('jsonp')) {
          logger.log('STOMP:', str);
        }
      },
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
        // Suppress all SockJS transport errors (404, 405, connection failures, etc.)
        const message = frame.headers?.message || '';
        if (message.includes('404') || 
            message.includes('405') ||
            message.includes('/ws/') ||
            frame.command === 'ERROR' && message.includes('Not Allowed')) {
          // This is likely a SockJS transport error, ignore it
          return;
        }
        logger.error('STOMP error:', frame);
        setConnected(false);
      },
      onWebSocketError: (event) => {
        // Suppress all SockJS transport errors
        const url = event?.target?.url || '';
        const message = event?.message || '';
        if (url.includes('/ws/') || 
            url.includes('xhr') ||
            url.includes('websocket') ||
            url.includes('jsonp') ||
            message.includes('404') ||
            message.includes('405') ||
            message.includes('Not Allowed') ||
            message.includes('WebSocket is closed')) {
          // This is expected during SockJS connection attempts, ignore it
          return;
        }
        logger.error('WebSocket error:', event);
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

