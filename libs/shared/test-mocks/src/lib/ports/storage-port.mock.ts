import { of } from 'rxjs';

export function createMockStoragePort() {
  return {
    get: jest.fn().mockReturnValue(of(null)),
    set: jest.fn().mockReturnValue(of(void 0)),
    remove: jest.fn().mockReturnValue(of(void 0)),
    clear: jest.fn().mockReturnValue(of(void 0)),
    has: jest.fn().mockReturnValue(of(false)),
  };
}
