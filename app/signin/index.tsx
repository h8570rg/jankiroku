"use client";

import { useAuth } from "~/lib/hooks/useAuth";

export const Signin = () => {
  const { signinEmail, signup, signout } = useAuth();

  const handleSignup = async () => {
    await signup({
      email: "namao0627@gmail.com",
      password: "test1234",
    });
  };

  const handleEmailLogin = async () => {
    await signinEmail({
      email: "namao0627@gmail.com",
      password: "test1234",
    });
  };

  const handleLogout = async () => {
    await signout();
  };

  return (
    <div>
      <button onClick={handleSignup}>signup</button>
      <button onClick={handleEmailLogin}>Email Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
