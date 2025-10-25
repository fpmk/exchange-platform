import { Observable } from 'rxjs';

/**
 * Storage Port - для сохранения настроек, layouts и т.д.
 */
export abstract class StoragePort {
  abstract get<T>(key: string): Observable<T | null>;

  abstract set<T>(key: string, value: T): Observable<void>;

  abstract remove(key: string): Observable<void>;

  abstract clear(): Observable<void>;

  abstract has(key: string): Observable<boolean>;
}
