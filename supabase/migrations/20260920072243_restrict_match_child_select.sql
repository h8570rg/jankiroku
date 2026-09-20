-- Hide games, scores, seats, and rules from users who are not in that match.
-- Membership checks run as definer so they do not recurse through RLS.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_match_member(p_match_id uuid)
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.matches m
    where m.id = p_match_id
      and (
        m.created_by = (select public.current_profile_id())
        or exists (
          select 1
          from public.match_players mp
          where mp.match_id = m.id
            and mp.player_id = (select public.current_profile_id())
        )
      )
  );
$function$;

create or replace function private.is_game_member(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select private.is_match_member(
    (select g.match_id from public.games g where g.id = p_game_id)
  );
$function$;

revoke all on function private.is_match_member(uuid) from public;
revoke all on function private.is_game_member(uuid) from public;
grant execute on function private.is_match_member(uuid) to authenticated;
grant execute on function private.is_game_member(uuid) to authenticated;

drop policy "Authenticated users can select matches" on public.matches;

-- INSERT ... RETURNING evaluates this policy for the row being inserted,
-- which is_match_member()'s lookup cannot see yet, so creators are
-- matched on the new row's own created_by.
create policy "Users can select their own matches"
  on public.matches
  as permissive
  for select
  to authenticated
  using (
    created_by = (select public.current_profile_id())
    or (select private.is_match_member(id))
  );

drop policy "Authenticeted Users can select." on public.match_players;

create policy "Users can select players of their matches"
  on public.match_players
  as permissive
  for select
  to authenticated
  using ((select private.is_match_member(match_id)));

drop policy "Authenticated users can select games" on public.games;

create policy "Users can select games of their matches"
  on public.games
  as permissive
  for select
  to authenticated
  using ((select private.is_match_member(match_id)));

drop policy "Authenticated users can select scores" on public.game_players;

create policy "Users can select scores of their games"
  on public.game_players
  as permissive
  for select
  to authenticated
  using ((select private.is_game_member(game_id)));

drop policy "Authenticeted users can select all rules" on public.rules;

create policy "Users can select rules of their matches"
  on public.rules
  as permissive
  for select
  to authenticated
  using ((select private.is_match_member(match_id)));
