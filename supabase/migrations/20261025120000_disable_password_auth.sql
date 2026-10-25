-- Disable email + password authentication in favor of email OTP.
--
-- Login now goes through `signInWithOtp` / `verifyOtp` only. Clearing
-- every stored password hash makes `signInWithPassword` fail for all
-- existing users even when the Auth API is called directly with the
-- publishable key. Users keep the same auth.users row, so they can sign
-- in with an OTP sent to the same address without any data migration.
--
-- The trigger keeps it that way: any attempt to set a password later
-- (e.g. `auth.updateUser({ password })` from the client, or a recovery
-- flow) is discarded. An empty string is what GoTrue itself stores for
-- passwordless users.

update auth.users
set encrypted_password = ''
where encrypted_password is distinct from '';

create or replace function public.discard_user_password()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  new.encrypted_password := '';
  return new;
end;
$function$;

revoke all on function public.discard_user_password() from public, anon, authenticated;

drop trigger if exists on_auth_user_password_set on auth.users;
create trigger on_auth_user_password_set
before insert or update of encrypted_password on auth.users
for each row
when (new.encrypted_password is distinct from '')
execute function public.discard_user_password();
