"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@/components/button";
import { addFriends } from "./actions";

type Props = {
  profileId: string;
  onSuccess?: () => void;
};

export function AddFriendButton({ profileId, onSuccess }: Props) {
  const [_, dispatchAction, isPending] = useActionState(async () => {
    await addFriends(profileId);
    onSuccess?.();
  }, null);

  const handlePress = () => {
    startTransition(() => {
      dispatchAction();
    });
  };

  return (
    <Button
      variant="primary"
      size="sm"
      onPress={handlePress}
      isPending={isPending}
    >
      追加
    </Button>
  );
}
