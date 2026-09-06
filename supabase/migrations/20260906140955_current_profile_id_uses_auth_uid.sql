-- Registered profiles.id is again auth.users.id, so the session actor's
-- profile id is auth.uid(). Skip the profiles lookup on every RLS check.

create or replace function public.current_profile_id() returns uuid
  language sql
  stable
  set search_path to 'public'
as $function$
  select auth.uid()
$function$;
