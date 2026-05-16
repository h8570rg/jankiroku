-- Phase 1: Decouple profiles.id from auth.users.id by introducing profiles.user_id.
--
-- This migration only adds the new column and keeps the existing
-- `profiles.id == auth.users.id` invariant intact. RLS policies and
-- application code continue to use the existing `auth.uid() = profiles.id`
-- relationship until a follow-up migration switches them to user_id.

alter table "public"."profiles"
  add column "user_id" uuid
  references auth.users(id) on update cascade on delete cascade;

-- Backfill user_id for existing rows whose id matches an auth.users row.
-- Orphan profiles (no matching auth.users row) keep user_id NULL — these
-- become the seed of the guest player concept in a later phase.
update public.profiles p
  set user_id = p.id
  where exists (select 1 from auth.users u where u.id = p.id);

alter table "public"."profiles"
  add constraint "profiles_user_id_key" unique (user_id);

-- Trigger: when a new auth user is created, also populate user_id so that
-- the new column stays in sync immediately. The id == user_id invariant is
-- preserved for the duration of phase 1 to avoid behavioural changes.
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
