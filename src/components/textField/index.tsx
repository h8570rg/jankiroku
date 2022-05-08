import {
  ChangeEventHandler,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useState,
} from "react";

type Props = {
  className?: string;
  error?: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = forwardRef<HTMLInputElement, Props>(
  ({ className, error, label, onChange, ...inputHTMLAttributes }, ref) => {
    return (
      <label className={className}>
        {label}
        <input
          className="border"
          onChange={onChange}
          {...inputHTMLAttributes}
          ref={ref}
        />
        {!!error && <p className="text-red-500 text-xs">{error}</p>}
      </label>
    );
  }
);

TextField.displayName = TextField.displayName || TextField.name;

export const useTextField = (initialValue?: string) => {
  const [value, setValue] = useState<string | undefined>(initialValue);
  const [error, setError] = useState<string | undefined>();

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setValue(e.currentTarget.value);
    },
    [setValue]
  );

  const reset = useCallback(() => {
    setValue(undefined);
    setError(undefined);
  }, [setValue]);

  const bind: {
    error: Props["error"];
    value: Props["value"];
    onChange: Props["onChange"];
  } = {
    error,
    value,
    onChange,
  };

  return {
    value,
    reset,
    setError,
    bind,
  };
};

export default TextField;
