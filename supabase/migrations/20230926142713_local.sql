alter table "public"."profiles" alter column "janreco_id" set not null;

alter table "public"."profiles" alter column "name" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, name, janreco_id)
  values (new.id, '', '');
  return new;
end;
$function$
;


