"use client";

import classNames from "classnames";
import { Button } from "~/components/Button";
import { GoogleIcon } from "~/components/SocialProviderIcon";
import { signInWithGoogle } from "./actions";

export function SocialProviders({ className }: { className?: string }) {
  return (
    <ul className={classNames("space-y-2", className)}>
      <li className="w-full">
        <Button
          fullWidth
          className="flex items-center justify-center gap-3"
          variant="bordered"
          onClick={() => signInWithGoogle()}
        >
          <GoogleIcon className="w-5" />
          <span>Google でログイン</span>
        </Button>
      </li>
      <li className="w-full">
        <Button
          fullWidth
          variant="bordered"
          onClick={() => alert("Coming soon!")} // TODO: 実装
        >
          <span>ログインせずに始める</span>
        </Button>
      </li>
    </ul>
  );
}
