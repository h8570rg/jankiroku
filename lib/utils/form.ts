import type { SubmissionResult } from "@conform-to/react/future";
import { startTransition } from "react";

type Callbacks<T, R = unknown> = {
  onStart?: () => R;
  onEnd?: (reference: R) => void;
  onSuccess?: (result: T) => void;
  onError?: (result: T) => void;
};

export const withCallbacks = <
  Args extends unknown[],
  T extends SubmissionResult,
  R = unknown,
>(
  fn: (...args: Args) => Promise<T>,
  callbacks?: Callbacks<T, R>,
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    const promise = fn(...args);
    const reference = callbacks?.onStart?.();
    const result = await promise;

    if (reference) {
      callbacks?.onEnd?.(reference);
    }
    if (!result.error) {
      callbacks?.onSuccess?.(result);
    }
    if (result.error) {
      callbacks?.onError?.(result);
    }

    return result;
  };
};

/**
 * Conform useFormのonSubmitで使用する共通ハンドラー。
 * preventDefault、formData取得、startTransitionでformActionを実行する。
 */
export const createSubmitHandler = (
  formAction: (formData: FormData) => void,
) => {
  return (
    event: React.SyntheticEvent,
    context?: {
      formData?: FormData;
    },
  ): void => {
    event.preventDefault();
    const formData =
      context?.formData ?? new FormData(event.target as HTMLFormElement);
    startTransition(() => {
      formAction(formData);
    });
  };
};
