"use client";

import { SearchField, Typography } from "@heroui/react";
import { useState } from "react";
import { User } from "@/components/user";
import type { Player } from "@/lib/type";
import { AddButton } from "../add-button";
import { FriendMenu } from "../friend-menu";

export function FriendsList({ friends }: { friends: Player[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredFriends = normalizedQuery
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(normalizedQuery) ||
          friend.displayId?.toLowerCase().includes(normalizedQuery),
      )
    : friends;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <SearchField
          aria-label="ユーザーIDもしくは名前で検索"
          className="min-w-0 flex-1"
          name="friends-filter"
          variant="secondary"
          value={query}
          onChange={setQuery}
        >
          <SearchField.Group className="w-full">
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="ユーザーIDもしくは名前で検索" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <AddButton />
      </div>
      {normalizedQuery && filteredFriends.length === 0 && (
        <Typography type="body-sm" color="muted" align="center" className="mt-10">
          見つかりませんでした
        </Typography>
      )}
      <ul className="space-y-1">
        {filteredFriends.map((friend) => (
          <li className="flex items-center justify-between py-1" key={friend.id}>
            <User name={friend.name} displayId={friend.displayId} avatarUrl={friend.avatarUrl} />
            <FriendMenu profileId={friend.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
