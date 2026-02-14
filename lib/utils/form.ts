type ActionState =
  | {
      message?: string;
      success?: boolean;
    }
  | null
  | undefined;

type Callbacks<T, R = unknown> = {
  onStart?: () => R;
  onEnd?: (reference: R) => void;
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

export const withCallbacks = <
  Args extends unknown[],
  T extends ActionState,
  R = unknown,
>(
  fn: (...args: Args) => Promise<T>,
  callbacks: Callbacks<T, R>,
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    const promise = fn(...args);
    const reference = callbacks.onStart?.();
    const result = await promise;

    if (reference) {
      callbacks.onEnd?.(reference);
    }
    if (result?.success) {
      callbacks.onSuccess?.(result);
    }
    if (!result?.success) {
      callbacks.onError?.(result);
    }

    return result;
  };
};
