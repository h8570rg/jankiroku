-- Phase 2c: remove `auth.uid()` column defaults.
--
-- These defaults were the last piece of the implicit assumption that
-- `auth.uid()` is a valid profile id. The application (PR #1222) now
-- looks up `profiles.id` via `profiles.user_id` and passes it
-- explicitly to every INSERT, so the defaults are no longer used.
--
-- Note: the handle_new_user trigger still inserts `(id, user_id) =
-- (new.id, new.id)` so the convenience invariant `profiles.id ==
-- auth.users.id` is kept for trigger-created profiles. Decoupling the
-- trigger as well is a separate, optional cleanup.

alter table "public"."friends" alter column "profile_id" drop default;
alter table "public"."game_players" alter column "player_id" drop default;
alter table "public"."games" alter column "created_by" drop default;
alter table "public"."match_players" alter column "player_id" drop default;
alter table "public"."matches" alter column "created_by" drop default;
alter table "public"."rules" alter column "created_by" drop default;
alter table "public"."rules" alter column "updated_by" drop default;
