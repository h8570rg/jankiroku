-- Decouple newly created profiles from auth.users.id.
--
-- Until now `handle_new_user` inserted `(id, user_id) = (new.id, new.id)`
-- so the historical invariant `profiles.id == auth.users.id` was kept
-- alive even after the schema technically supported a separation.
--
-- After this migration new profiles get a freshly generated
-- `profiles.id` (via the `gen_random_uuid()` column default) and only
-- `user_id` is tied to `auth.users.id`. The application already
-- resolves the current profile via `profiles.user_id`, so this change
-- has no runtime impact for users created from this point on. Existing
-- rows are not touched.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$function$;
