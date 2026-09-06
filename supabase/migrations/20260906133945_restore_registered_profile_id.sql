-- Restore `profiles.id = auth.users.id` for registered users.
--
-- Guests (`user_id IS NULL`) keep their own id. Existing registered
-- rows created after `20260516122600_decouple_handle_new_user` may have
-- `id <> user_id`; those are rewritten below. Application code still
-- resolves the current profile via `profiles.user_id`, so this change
-- is compatible with the current `getUserProfileId` lookup.

-- 1. Let the PK rewrite cascade to child tables that lacked ON UPDATE.
--    ON DELETE behaviour is unchanged (NO ACTION).

alter table "public"."game_players"
  drop constraint "scores_profile_id_fkey";

alter table "public"."game_players"
  add constraint "scores_profile_id_fkey"
  foreign key (player_id) references public.profiles(id) on update cascade;

alter table "public"."match_players"
  drop constraint "matches_profiles_profile_id_fkey";

alter table "public"."match_players"
  add constraint "matches_profiles_profile_id_fkey"
  foreign key (player_id) references public.profiles(id) on update cascade;

alter table "public"."matches"
  drop constraint "matches_created_by_fkey";

alter table "public"."matches"
  add constraint "matches_created_by_fkey"
  foreign key (created_by) references public.profiles(id) on update cascade;

alter table "public"."rules"
  drop constraint "rules_created_by_fkey";

alter table "public"."rules"
  add constraint "rules_created_by_fkey"
  foreign key (created_by) references public.profiles(id) on update cascade;

alter table "public"."rules"
  drop constraint "rules_updated_by_fkey";

alter table "public"."rules"
  add constraint "rules_updated_by_fkey"
  foreign key (updated_by) references public.profiles(id) on update cascade;

-- 2. New signups get matching ids again.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, user_id)
  values (new.id, new.id);
  return new;
end;
$function$;

-- 3. Refuse to rewrite if the target id is already taken by another row.

do $$
begin
  if exists (
    select 1
    from public.profiles p
    where p.user_id is not null
      and p.id <> p.user_id
      and exists (
        select 1 from public.profiles o where o.id = p.user_id
      )
  ) then
    raise exception
      'Cannot rewrite profiles.id: target user_id is already used as another profile id';
  end if;
end
$$;

-- 4. Align registered profiles. Child FKs follow via ON UPDATE CASCADE.

update public.profiles
set id = user_id
where user_id is not null
  and id <> user_id;
