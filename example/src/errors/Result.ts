interface Err<T> {
  success: false;
  error: T;
}

interface Ok<T> {
  success: true;
  value: T;
}

export const Ok = <T>(value: T): Ok<T> => ({ success: true, value });
export const Err = <T>(error: T): Err<T> => ({ success: false, error });

export type AllReturn<T, E> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      error: E;
    };

export type Result<T, E> = Ok<T> | Err<E>;

type Pattern<T, E, A, B> = {
  Ok: (value: T) => A;
  Err: (error: E) => B;
};

export const ResultFns = {
  match<T, E>(result: Result<T, E>) {
    return <A, B>(pattern: Pattern<T, E, A, B>) => {
      if (result.success) {
        return pattern.Ok(result.value);
      } else {
        return pattern.Err(result.error);
      }
    };
  },

  unwrap<T, E>(result: Result<T, E>): T {
    if (result.success) {
      return result.value;
    } else {
      throw new Error('tried to unwrap an error');
    }
  },

  unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
      return result.value;
    } else {
      return defaultValue;
    }
  },
};
