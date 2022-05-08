import { useCallback, useEffect, useState } from "react";
import { createAccountWithEmailAndPassword } from "@/apis/auth";
import TextField, { useTextField } from "src/components/textField";

const Signup = () => {
  const [submitConfirmed, setSubmitConfirmed] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const email = useTextField();
  const password = useTextField();

  // TODO: refactor
  const validate = useCallback(() => {
    let _isValid = true;
    if (!email.value) {
      _isValid = false;
      email.setError("メールアドレスが入力されていません");
    } else {
      _isValid = true;
      email.setError(undefined);
    }
    if (!password.value) {
      _isValid = false;
      password.setError("パスワードが入力されていません");
    } else {
      _isValid = true;
      password.setError(undefined);
    }
    setIsValid(_isValid);
  }, [email, password]);

  const signup = useCallback((email: string, password: string) => {
    createAccountWithEmailAndPassword(email, password);
  }, []);

  const handleSubmitClick = useCallback(() => {
    validate();
    setSubmitConfirmed(true);
  }, [validate]);

  useEffect(() => {
    if (!submitConfirmed || !isValid || !email.value || !password.value) {
      return;
    }
    signup(email.value, password.value);
    setSubmitConfirmed(false);
  }, [email.value, isValid, password.value, signup, submitConfirmed]);

  return (
    <>
      <h1>アカウントを作成</h1>
      <form>
        <TextField
          label="email"
          type="email"
          autoComplete="email"
          {...email.bind}
        />
        <TextField
          label="password"
          type="password"
          autoComplete="new-password"
          {...password.bind}
        />
        <button type="button" onClick={handleSubmitClick}>
          送信
        </button>
      </form>
    </>
  );
};

export default Signup;
