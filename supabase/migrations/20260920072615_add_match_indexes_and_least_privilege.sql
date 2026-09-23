-- Indexes used by home queries and RLS, one rule row per match, and
-- least-privilege grants (anon should not have table rights).

create index if not exists match_players_player_id_idx
  on public.match_players (player_id);

create index if not exists friends_friend_id_idx
  on public.friends (friend_id);

create index if not exists games_match_id_idx
  on public.games (match_id);

create index if not exists games_created_by_idx
  on public.games (created_by);

create index if not exists matches_created_by_idx
  on public.matches (created_by);

create index if not exists game_players_player_id_idx
  on public.game_players (player_id);

create unique index if not exists rules_match_id_key
  on public.rules (match_id);

alter table public.rules
  drop constraint if exists rules_players_count_check,
  add constraint rules_players_count_check
    check (players_count in (3, 4));

alter table public.rules
  drop constraint if exists rules_calc_method_check,
  add constraint rules_calc_method_check
    check (calc_method in ('round', 'roundOff', 'roundDown', 'roundUp'));

alter table public.friends
  drop constraint if exists friends_no_self_check,
  add constraint friends_no_self_check
    check (profile_id <> friend_id);

alter table public.game_players
  drop constraint if exists game_players_rank_positive,
  add constraint game_players_rank_positive
    check (rank >= 1);

revoke all on table public.friends from anon, authenticated;
revoke all on table public.game_players from anon, authenticated;
revoke all on table public.games from anon, authenticated;
revoke all on table public.match_players from anon, authenticated;
revoke all on table public.matches from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.rules from anon, authenticated;

grant select, insert, delete on table public.friends to authenticated;
grant select, insert, delete on table public.game_players to authenticated;
grant select, insert, delete on table public.games to authenticated;
grant select, insert, delete on table public.match_players to authenticated;
grant select, insert on table public.matches to authenticated;
grant select, insert on table public.profiles to authenticated;
grant select, insert on table public.rules to authenticated;

grant update (chip_count, "order") on table public.match_players to authenticated;
grant update (name, display_id, avatar_url) on table public.profiles to authenticated;

-- Unused: the app never updates guest rows, and two UPDATE policies on
-- profiles trip the multiple_permissive_policies advisor.
drop policy if exists "Users can update guest profiles they created" on public.profiles;

