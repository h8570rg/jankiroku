"use client";

import { useSupabase } from "~/components/SupabaseProvider";
import { useSignupEmail } from "~/lib/hooks/api/signup/email";

export const Signin = () => {
  const { trigger: signupEmail } = useSignupEmail();
  const { supabase } = useSupabase();

  const handleSignup = async () => {
    await signupEmail({
      email: "namao0627@gmail.com",
      password: "test1234",
    });
  };

  const handleEmailLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "namao0627@gmail.com",
      password: "test1234",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <button onClick={handleSignup}>signup</button>
      <button onClick={handleEmailLogin}>Email Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
