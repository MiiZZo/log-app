export interface SuccessResult<T> {
  ok: true;
  data: T;
}

export interface ErrorResult<T> {
  ok: false;
  data: null;
  error?: string;
}

export type Result<T> = SuccessResult<T> | ErrorResult<T>;
