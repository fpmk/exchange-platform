import { StoragePort } from '@exchange-platform/ports';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable()
export class LocalStorageAdapter implements StoragePort {
  get<T>(key: string): Observable<T | null> {
    const item = localStorage.getItem(key);
    return of(item ? JSON.parse(item) : null);
  }

  set<T>(key: string, value: T): Observable<void> {
    localStorage.setItem(key, JSON.stringify(value));
    return EMPTY;
  }

  remove(key: string): Observable<void> {
    localStorage.removeItem(key);
    return EMPTY;
  }

  clear(): Observable<void> {
    localStorage.clear();
    return EMPTY;
  }

  has(key: string): Observable<boolean> {
    return of(localStorage.getItem(key) != null);
  }
}
