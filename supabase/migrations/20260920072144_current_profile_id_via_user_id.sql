-- RLS helpers must follow profiles.user_id, not the historical
-- `profiles.id = auth.uid()` invariant. Registered rows currently still
-- share that id, so this is behavior-preserving while keeping policies
-- correct if the ids diverge again.

create or replace function public.current_profile_id()
returns uuid
language sql
stable
set search_path to ''
as $function$
  select id
  from public.profiles
  where user_id = (select auth.uid())
$function$;
