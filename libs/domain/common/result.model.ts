/**
 * Result Pattern для обработки ошибок
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  success: true;
  value: T;
}

export interface Failure<E> {
  success: false;
  error: E;
}

export const success = <T>(value: T): Success<T> => ({
  success: true,
  value,
});

export const failure = <E>(error: E): Failure<E> => ({
  success: false,
  error,
});
