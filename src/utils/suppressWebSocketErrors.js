// Global WebSocket error suppression
// This runs immediately when imported to suppress all SockJS-related console errors

(function() {
  'use strict';
  
  // Only set up once
  if (window._webSocketErrorSuppressionActive) {
    return;
  }
  window._webSocketErrorSuppressionActive = true;
  
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  
  // Suppress all SockJS-related console errors
  const suppressSockJSErrors = (...args) => {
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
        message.includes('Aborting the connection') ||
        message.includes('the server responded with a status of')) {
      return; // Suppress this error
    }
    originalConsoleError.apply(console, args);
  };
  
  const suppressSockJSWarnings = (...args) => {
    const message = String(args.join(' '));
    // Suppress SockJS warnings
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
  
  // Override console methods
  console.error = suppressSockJSErrors;
  console.warn = suppressSockJSWarnings;
  
  // Intercept global error handler
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
  
  // Intercept unhandled promise rejections
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
  
  // Intercept XMLHttpRequest
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
  
  // Intercept EventSource
  const originalEventSource = window.EventSource;
  if (originalEventSource) {
    window.EventSource = function(url, ...rest) {
      if (url && url.includes('/ws/')) {
        // Suppress EventSource errors for SockJS
        const es = new originalEventSource(url, ...rest);
        es.addEventListener('error', (e) => {
          e.stopPropagation();
          e.preventDefault();
        });
        return es;
      }
      return new originalEventSource(url, ...rest);
    };
  }
  
  // Intercept WebSocket constructor
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
        };
        // Also intercept addEventListener for error events
        const originalAddEventListener = ws.addEventListener;
        ws.addEventListener = function(type, listener, options) {
          if (type === 'error' || type === 'close') {
            const wrappedListener = function(event) {
              event.stopPropagation();
              event.preventDefault();
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
})();

