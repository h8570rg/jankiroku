-- Guests are not globally visible. Record who created them so INSERT
-- ... RETURNING still works, and allow reads for creators, co-players,
-- and friends.
--
-- current_profile_id() reads profiles, so it cannot stay invoker once
-- profiles SELECT policies call it.

create or replace function private.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path to ''
as $function$
  select id
  from public.profiles
  where user_id = (select auth.uid())
$function$;

revoke all on function private.current_profile_id() from public;
grant execute on function private.current_profile_id() to authenticated;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
set search_path to ''
as $function$
  select private.current_profile_id()
$function$;

alter table public.profiles
  add column created_by uuid references public.profiles(id) on delete set null;

create index profiles_created_by_idx on public.profiles (created_by);

create or replace function private.can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from public.match_players mp
    where mp.player_id = p_profile_id
      and private.is_match_member(mp.match_id)
  );
$function$;

revoke all on function private.can_view_profile(uuid) from public;
grant execute on function private.can_view_profile(uuid) to authenticated;

drop policy "Public profiles are viewable by everyone." on public.profiles;

create policy "Users can select visible profiles"
  on public.profiles
  as permissive
  for select
  to authenticated
  using (
    user_id is not null
    or id = (select public.current_profile_id())
    or created_by = (select public.current_profile_id())
    or exists (
      select 1
      from public.friends f
      where f.profile_id = (select public.current_profile_id())
        and f.friend_id = profiles.id
    )
    or (select private.can_view_profile(id))
  );

drop policy "Users can insert guest profiles" on public.profiles;

create policy "Users can insert guest profiles"
  on public.profiles
  as permissive
  for insert
  to authenticated
  with check (
    user_id is null
    and display_id is null
    and created_by = (select public.current_profile_id())
  );

drop policy "Users can update own profile." on public.profiles;

create policy "Users can update own profile."
  on public.profiles
  as permissive
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can update guest profiles they created"
  on public.profiles
  as permissive
  for update
  to authenticated
  using (
    user_id is null
    and created_by = (select public.current_profile_id())
  )
  with check (
    user_id is null
    and created_by = (select public.current_profile_id())
  );
