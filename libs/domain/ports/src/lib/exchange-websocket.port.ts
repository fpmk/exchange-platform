import { Observable } from 'rxjs';

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error';

export interface ConnectionEvent {
  status: ConnectionStatus;
  timestamp: number;
  error?: string;
}

export abstract class ExchangeWebsocketPort {
  abstract connect(): Observable<ConnectionEvent>;

  abstract disconnect(): void;

  abstract subscribe<T>(channel: string): Observable<T>;

  abstract unsubscribe(channel: string): void;

  abstract getConnectionStatus(): Observable<ConnectionStatus>;
}
