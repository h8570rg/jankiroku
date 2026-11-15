<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ローカル Supabase

- worktree ごとに別の DB が動く。作業の初めに `pnpm run supabase:start` を実行する（接続先は `.env.local` に書き出される）
- セッションが終わると、その worktree の DB は削除される
- 同じ worktree で `pnpm run dev` が動いていると E2E は起動できない。その dev サーバーは止めず、ユーザーに伝える
- 詳しくは README.md の「ローカル Supabase」
