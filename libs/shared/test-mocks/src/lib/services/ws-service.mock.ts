import { Subject } from 'rxjs';

export function createMockWSService() {
  return {
    onMessage$: new Subject().asObservable(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
  };
}
