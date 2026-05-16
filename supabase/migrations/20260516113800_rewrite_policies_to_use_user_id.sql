-- Phase 2a: Rewrite all RLS policies that implicitly assumed
-- `auth.uid() == profiles.id` to look up the current user's profile id
-- via the new `profiles.user_id` column.
--
-- Phase 1 preserved the invariant `profiles.id == profiles.user_id` for
-- every existing row and for every new auth user (via handle_new_user),
-- so swapping `auth.uid()` for `public.current_profile_id()` keeps the
-- behaviour identical for all current data. Once Phase 2c removes the
-- `auth.uid()`-based column defaults, the invariant is allowed to break
-- (new profiles will get fresh uuids) and policies will keep working
-- because they reference profiles.user_id explicitly.

create or replace function public.current_profile_id() returns uuid
  language sql
  stable
  set search_path to 'public'
as $function$
  select id from public.profiles where user_id = auth.uid()
$function$;


-- friends -----------------------------------------------------------------

drop policy "Enable all access for their own friend." on public.friends;

create policy "Enable all access for their own friend."
  on public.friends
  as permissive
  for all
  to public
  using (
    (profile_id = public.current_profile_id())
    or (friend_id = public.current_profile_id())
  );


-- game_players ------------------------------------------------------------

drop policy "Users can delete their own match's score" on public.game_players;

create policy "Users can delete their own match's score"
  on public.game_players
  as permissive
  for delete
  to public
  using (
    public.current_profile_id() in (
      select match_players.player_id
      from public.match_players
      join public.games on match_players.match_id = games.match_id
      where games.id = game_players.game_id
    )
  );

drop policy "Users can insert their own match's score" on public.game_players;

create policy "Users can insert their own match's score"
  on public.game_players
  as permissive
  for insert
  to public
  with check (
    public.current_profile_id() in (
      select match_players.player_id
      from public.match_players
      join public.games on match_players.match_id = games.match_id
      where games.id = game_players.game_id
    )
  );

drop policy "Users can update their own match's score" on public.game_players;

create policy "Users can update their own match's score"
  on public.game_players
  as permissive
  for update
  to public
  using (
    public.current_profile_id() in (
      select match_players.player_id
      from public.match_players
      join public.games on match_players.match_id = games.match_id
      where games.id = game_players.game_id
    )
  );


-- games -------------------------------------------------------------------

drop policy "Users can delete thier own game." on public.games;

create policy "Users can delete their own game."
  on public.games
  as permissive
  for delete
  to public
  using (
    match_id in (
      select match_players.match_id
      from public.match_players
      where match_players.player_id = public.current_profile_id()
    )
  );

drop policy "Users can insert thier own game." on public.games;

create policy "Users can insert their own game."
  on public.games
  as permissive
  for insert
  to public
  with check (
    match_id in (
      select match_players.match_id
      from public.match_players
      where match_players.player_id = public.current_profile_id()
    )
  );

drop policy "Users can update thier own game." on public.games;

create policy "Users can update their own game."
  on public.games
  as permissive
  for update
  to public
  using (
    match_id in (
      select match_players.match_id
      from public.match_players
      where match_players.player_id = public.current_profile_id()
    )
  );


-- match_players -----------------------------------------------------------

drop policy "Users can delete own thier match's player" on public.match_players;

create policy "Users can delete their own match's player"
  on public.match_players
  as permissive
  for delete
  to public
  using (
    match_id in (
      select mp.match_id
      from public.match_players mp
      where mp.player_id = public.current_profile_id()
    )
  );

drop policy "Users can insert own thier match's player" on public.match_players;

create policy "Users can insert their own match's player"
  on public.match_players
  as permissive
  for insert
  to public
  with check (
    (
      match_id in (
        select matches.id
        from public.matches
        join public.match_players mp on matches.id = mp.match_id
        where mp.player_id = public.current_profile_id()
      )
    )
    or (
      match_id in (
        select matches.id
        from public.matches
        where matches.created_by = public.current_profile_id()
      )
    )
  );

drop policy "Users can update own thier match's player" on public.match_players;

create policy "Users can update their own match's player"
  on public.match_players
  as permissive
  for update
  to public
  using (
    match_id in (
      select mp.match_id
      from public.match_players mp
      where mp.player_id = public.current_profile_id()
    )
  );


-- matches -----------------------------------------------------------------

drop policy "Authenticated users can select matches" on public.matches;

create policy "Authenticated users can select matches"
  on public.matches
  as permissive
  for select
  to public
  using (
    (
      exists (
        select 1
        from public.match_players
        where match_players.match_id = matches.id
          and match_players.player_id = public.current_profile_id()
      )
    )
    or (created_by = public.current_profile_id())
  );


-- profiles ----------------------------------------------------------------

drop policy "Users can update own profile." on public.profiles;

create policy "Users can update own profile."
  on public.profiles
  as permissive
  for update
  to authenticated
  using (auth.uid() = user_id);


-- rules -------------------------------------------------------------------

drop policy "Users can insert their own match's rule" on public.rules;

create policy "Users can insert their own match's rule"
  on public.rules
  as permissive
  for insert
  to public
  with check (
    (
      match_id in (
        select match_players.match_id
        from public.match_players
        where match_players.player_id = public.current_profile_id()
      )
    )
    or (
      match_id in (
        select matches.id
        from public.matches
        where matches.created_by = public.current_profile_id()
      )
    )
  );
