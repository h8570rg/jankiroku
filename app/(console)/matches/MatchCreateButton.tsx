"use client";

import { useMatchCreate } from "~/lib/hooks/api/match";

export function MatchCreateButton() {
  const { trigger: createMatch } = useMatchCreate();
  const create = () => {
    createMatch();
  };
  return (
    <button
      className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      onClick={create}
    >
      Create Game
    </button>
  );
}
