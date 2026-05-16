-- Switch profiles.user_id FK from ON DELETE CASCADE to ON DELETE SET NULL.
--
-- Background:
--   Other tables (match_players.player_id, matches.created_by,
--   rules.created_by/updated_by, etc.) reference profiles(id) without
--   ON DELETE CASCADE. Cascading a profile delete from auth.users would
--   therefore fail with an FK violation whenever the user has any
--   match history.
--
--   The intended design for guest players is: a profile without an
--   associated auth user IS a guest. SET NULL aligns auth-user deletion
--   with that semantics — the profile (and its history) is preserved
--   and becomes a guest player.

alter table "public"."profiles"
  drop constraint "profiles_user_id_fkey";

alter table "public"."profiles"
  add constraint "profiles_user_id_fkey"
  foreign key (user_id) references auth.users(id)
  on update cascade on delete set null;
