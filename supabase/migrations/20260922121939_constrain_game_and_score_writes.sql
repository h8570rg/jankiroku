-- Games/rules INSERT must attribute created_by (and rules.updated_by) to
-- the session profile. Score rows must belong to a seated match player.

create or replace function private.is_seated_in_game(p_game_id uuid, p_player_id uuid)
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.games g
    join public.match_players mp on mp.match_id = g.match_id
    where g.id = p_game_id
      and mp.player_id = p_player_id
  );
$function$;

revoke all on function private.is_seated_in_game(uuid, uuid) from public;
grant execute on function private.is_seated_in_game(uuid, uuid) to authenticated;

drop policy "Users can insert their own game." on public.games;

create policy "Users can insert their own game."
  on public.games
  as permissive
  for insert
  to authenticated
  with check (
    (select private.is_match_member(match_id))
    and created_by = (select public.current_profile_id())
  );

drop policy "Users can insert their own match's rule" on public.rules;

create policy "Users can insert their own match's rule"
  on public.rules
  as permissive
  for insert
  to authenticated
  with check (
    (select private.is_match_member(match_id))
    and created_by = (select public.current_profile_id())
    and updated_by = (select public.current_profile_id())
  );

drop policy "Users can insert their own match's score" on public.game_players;

create policy "Users can insert their own match's score"
  on public.game_players
  as permissive
  for insert
  to authenticated
  with check (
    (select private.is_game_member(game_id))
    and (select private.is_seated_in_game(game_id, player_id))
  );
