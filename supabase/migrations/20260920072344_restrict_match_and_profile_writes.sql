-- Stop clients from inserting matches as someone else, or from inserting
-- registered-looking profiles. Align remaining write policies with match
-- membership and drop unused game/score UPDATE policies.

drop policy "Authenticeted users can insert matches" on public.matches;

create policy "Users can insert their own matches"
  on public.matches
  as permissive
  for insert
  to authenticated
  with check (created_by = (select public.current_profile_id()));

drop policy "Authenticated users can insert their own profile." on public.profiles;

create policy "Users can insert guest profiles"
  on public.profiles
  as permissive
  for insert
  to authenticated
  with check (
    user_id is null
    and display_id is null
  );

drop policy "Users can update own profile." on public.profiles;

create policy "Users can update own profile."
  on public.profiles
  as permissive
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy "Users can delete their own game." on public.games;
drop policy "Users can insert their own game." on public.games;
drop policy "Users can update their own game." on public.games;

create policy "Users can delete their own game."
  on public.games
  as permissive
  for delete
  to authenticated
  using ((select private.is_match_member(match_id)));

create policy "Users can insert their own game."
  on public.games
  as permissive
  for insert
  to authenticated
  with check ((select private.is_match_member(match_id)));

drop policy "Users can delete their own match's score" on public.game_players;
drop policy "Users can insert their own match's score" on public.game_players;
drop policy "Users can update their own match's score" on public.game_players;

create policy "Users can delete their own match's score"
  on public.game_players
  as permissive
  for delete
  to authenticated
  using ((select private.is_game_member(game_id)));

create policy "Users can insert their own match's score"
  on public.game_players
  as permissive
  for insert
  to authenticated
  with check ((select private.is_game_member(game_id)));

drop policy "Users can delete their own match's player" on public.match_players;
drop policy "Users can insert their own match's player" on public.match_players;
drop policy "Users can update their own match's player" on public.match_players;

create policy "Users can delete their own match's player"
  on public.match_players
  as permissive
  for delete
  to authenticated
  using ((select private.is_match_member(match_id)));

create policy "Users can insert their own match's player"
  on public.match_players
  as permissive
  for insert
  to authenticated
  with check ((select private.is_match_member(match_id)));

create policy "Users can update their own match's player"
  on public.match_players
  as permissive
  for update
  to authenticated
  using ((select private.is_match_member(match_id)))
  with check ((select private.is_match_member(match_id)));

drop policy "Users can insert their own match's rule" on public.rules;

create policy "Users can insert their own match's rule"
  on public.rules
  as permissive
  for insert
  to authenticated
  with check ((select private.is_match_member(match_id)));
