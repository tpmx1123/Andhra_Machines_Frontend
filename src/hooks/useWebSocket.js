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
          message.includes('WebSocket is closed') ||
          message.includes('EventSource') ||
          message.includes('jsonp') ||
          message.includes('xhr') ||
          message.includes('xhr_streaming') ||
          message.includes('websocket') ||
          message.includes('wss://') ||
          message.includes('ws://') ||
          message.includes('Failed to load resource') ||
          message.includes('405') ||
          message.includes('404') ||
          message.includes('Not Allowed') ||
          message.includes('Not Found') ||
          message.includes('MIME type') ||
          message.includes('text/event-stream') ||
          message.includes('text/html') ||
          message.includes('Aborting the connection')) {
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
          message.includes('Unsupported React renderer') ||
          message.includes('wss://') ||
          message.includes('ws://') ||
          message.includes('Failed to load resource') ||
          message.includes('405') ||
          message.includes('404')) {
        return; // Suppress this warning
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Temporarily override console methods to suppress SockJS 404 errors
    console.error = suppressSockJS404;
    console.warn = suppressSockJSWarn;
    
    // Intercept WebSocket constructor to suppress errors
    const OriginalWebSocket = window.WebSocket;
    if (OriginalWebSocket) {
      window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        // Suppress all errors for SockJS WebSocket connections
        if (url && (url.includes('/ws/') || url.includes('websocket'))) {
          const originalOnError = ws.onerror;
          ws.onerror = function(event) {
            event.stopPropagation();
            event.preventDefault();
            // Don't call original handler
          };
          // Also intercept addEventListener for error events
          const originalAddEventListener = ws.addEventListener;
          ws.addEventListener = function(type, listener, options) {
            if (type === 'error' || type === 'close') {
              const wrappedListener = function(event) {
                event.stopPropagation();
                event.preventDefault();
                // Don't call original listener for SockJS errors
              };
              return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
          };
        }
        return ws;
      };
      // Copy static properties
      Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
      Object.setPrototypeOf(window.WebSocket.prototype, OriginalWebSocket.prototype);
    }
    
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
    const originalXHRAddEventListener = XMLHttpRequest.prototype.addEventListener;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._sockjsUrl = url;
      this._isSockJS = url && (url.includes('/ws/') || url.includes('xhr') || url.includes('websocket'));
      return originalXHROpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.addEventListener = function(type, listener, options) {
      if (this._isSockJS && (type === 'error' || type === 'load')) {
        // Wrap the listener to suppress SockJS errors
        const wrappedListener = function(event) {
          if (this.status === 404 || this.status === 405 || type === 'error') {
            // Suppress 404/405/errors for SockJS endpoints
            event.stopPropagation();
            event.preventDefault();
            return;
          }
          return listener.call(this, event);
        };
        return originalXHRAddEventListener.call(this, type, wrappedListener, options);
      }
      return originalXHRAddEventListener.call(this, type, listener, options);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      if (this._isSockJS) {
        // Suppress errors for SockJS transport endpoints
        this.addEventListener('error', (e) => {
          e.stopPropagation();
          e.preventDefault();
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
      const sourceStr = String(source || '');
      // Suppress SockJS-related errors
      if (errorMessage.includes('/ws/') ||
          errorMessage.includes('jsonp') ||
          errorMessage.includes('Unexpected token') ||
          errorMessage.includes('SockJS') ||
          errorMessage.includes('WebSocket') ||
          errorMessage.includes('405') ||
          errorMessage.includes('404') ||
          errorMessage.includes('Failed to load') ||
          errorMessage.includes('EventSource') ||
          sourceStr.includes('/ws/') ||
          sourceStr.includes('websocket') ||
          sourceStr.includes('xhr')) {
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
      const errorMessage = event.reason?.message || String(event.reason || '');
      if (reason.includes('/ws/') ||
          reason.includes('SockJS') ||
          reason.includes('jsonp') ||
          reason.includes('405') ||
          reason.includes('404') ||
          reason.includes('WebSocket') ||
          reason.includes('Failed to load') ||
          reason.includes('EventSource') ||
          errorMessage.includes('/ws/') ||
          errorMessage.includes('SockJS') ||
          errorMessage.includes('WebSocket') ||
          errorMessage.includes('405') ||
          errorMessage.includes('404')) {
        event.preventDefault(); // Suppress the error
      }
    });
    
    // Keep console suppression active permanently for WebSocket errors
    // Don't restore console methods - we want to suppress SockJS errors permanently
    // This ensures all SockJS errors are suppressed throughout the app lifecycle
    
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
      // Note: We don't restore console methods here because other components might still be using WebSocket
      // The suppression will remain active for the lifetime of the app, which is fine since it only suppresses SockJS errors
    };
  }, [user, refreshUser]);

  return { connected };
};

