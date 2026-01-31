export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface ActiveConnection {
  id: string;
  userId: number;
  userName: string;
  timestamp: number;
  action: 'view' | 'edit' | 'delete';
}

interface WebSocketMessage {
  type: 'connect' | 'disconnect' | 'action' | 'heartbeat' | 'sync';
  payload: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private status: ConnectionStatus = 'disconnected';
  private listeners: Map<string, Set<Function>> = new Map();

  constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.status = 'connecting';
        this.emit('statusChange', this.status);

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.status = 'connected';
          this.reconnectAttempts = 0;
          this.emit('statusChange', this.status);
          console.log('WebSocket подключен');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Ошибка парсинга сообщения:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket ошибка:', error);
          this.status = 'disconnected';
          this.emit('statusChange', this.status);
          reject(error);
        };

        this.ws.onclose = () => {
          this.status = 'disconnected';
          this.emit('statusChange', this.status);
          console.log('WebSocket отключен');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'connect':
        this.emit('connectionAdded', message.payload as ActiveConnection);
        break;
      case 'disconnect':
        this.emit('connectionRemoved', message.payload as string);
        break;
      case 'sync':
        this.emit('connectionsSynced', message.payload as ActiveConnection[]);
        break;
      case 'action':
        this.emit('actionUpdate', message.payload);
        break;
      case 'heartbeat':
        this.emit('heartbeat', message.payload);
        // Отправляем количество подключений из heartbeat
        if (message.payload && message.payload.activeConnections) {
          this.emit('connectionCountUpdate', message.payload.activeConnections);
        }
        break;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`
      );
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Ошибка переподключения:', error);
        });
      }, this.reconnectDelay);
    } else {
      console.error('Не удалось переподключиться после максимального количества попыток');
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket не подключен');
    }
  }

  sendConnection(connection: ActiveConnection): void {
    console.log('🔵 sendConnection вызван с:', connection);
    this.send({
      type: 'connect',
      payload: connection,
    });
  }

  sendDisconnection(connectionId: string): void {
    this.send({
      type: 'disconnect',
      payload: connectionId,
    });
  }

  sendAction(action: any): void {
    this.send({
      type: 'action',
      payload: action,
    });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => {
        callback(data);
      });
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.status = 'disconnected';
      this.emit('statusChange', this.status);
    }
  }

  isConnected(): boolean {
    return this.status === 'connected';
  }
}

export const wsService = new WebSocketService(
  import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
);
